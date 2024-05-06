import {
	AuthOptions,
	DefaultSession,
	DefaultUser,
	getServerSession,
} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { DefaultJWT } from "next-auth/jwt";

type TCredentials = { studentId: string; password: string };

declare module "next-auth/jwt" {
	interface JWT extends Record<string, any>, DefaultJWT {
		id: string;
		studentIdentificationId: number;
		studentIdentification: {
			id: number;
			studentId: string;
			isRegistered: boolean;
		};
		firstName: string;
		lastName: string;
		role: string;
		token: string;
	}
}

declare module "next-auth" {
	interface Session extends DefaultSession {
		user: {
			id: string;
			studentIdentificationId: number;
			studentIdentification: {
				id: number;
				studentId: string;
				isRegistered: boolean;
			};
			firstName: string;
			lastName: string;
			role: string;
			token: string;
		} & DefaultSession["user"];
	}
	interface User extends DefaultUser {
		studentIdentificationId: number;
		studentIdentification: {
			id: number;
			studentId: string;
			isRegistered: boolean;
		};
		firstName: string;
		lastName: string;
		role: string;
		token: string;
		error?: string[] | null
	}
}

export const AuthConfig = {
	session: {
		strategy: "jwt",
		maxAge: 2 * 60 * 60
	},
	providers: [
		CredentialsProvider({
			type: "credentials",
			name: "credentials",
			credentials: {},
			async authorize(credentials, req) {
				try {
					const { studentId, password } = credentials as TCredentials;

					const res = await fetch(process.env.ENDPOINT_URL + "/auth/login", {
						method: "POST",
						body: JSON.stringify({ studentId, password }),
						headers: { "Content-Type": "application/json" },
					});
					const response = await res.json();

					if (response.error) {
						console.log(response)
						return { error: response.details}
					}

					return {
						...response.userDetails,
						name:
							response.userDetails.firstName +
							" " +
							response.userDetails.lastName,
						token: response.token,
					};
				} catch (error) {
					console.log(error);
				}
			},
		}),
	],
	jwt: {
		secret: process.env.NEXTAUTH_SECRET,
		maxAge: 2 * 60 * 60
	},
	callbacks: {
		async signIn({user}) {
			if (user.error) {
				throw new Error(JSON.stringify(user.error));
			}

			return true;
		},
		async jwt({ token, user }) {
			if (user) {
				token.id = user.id;
				token.studentIdentificationId = user.studentIdentificationId;
				token.studentIdentification = user.studentIdentification;
				token.firstName = user.firstName;
				token.lastName = user.lastName;
				token.role = user.role;
				token.token = user.token;
			}

			if (!token) {
				console.log("No token found");
			}

			return token;
		},
		async session({ token, session, user }) {
			if (token) {
				session.user = {
					id: token.id as string,
					name: token.name,
					email: token.email,
					image: token.picture,
					studentIdentificationId: token.studentIdentificationId,
					studentIdentification: token.studentIdentification,
					firstName: token.firstName,
					lastName: token.lastName,
					role: token.role,
					token: token.token,
				};
			}

			return session;
		},
	},
	secret: process.env.NEXTAUTH_SECRET,
	pages: {
		signIn: "/login",
		signOut: "/login"
	},
} satisfies AuthOptions;

export function getSession() {
	return getServerSession(AuthConfig);
}