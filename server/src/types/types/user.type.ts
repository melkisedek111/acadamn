import { TStudentIdentification } from "./studentIdentification.type";

export type TUser = {
	id: number;
	firstName: string;
	middleName: string | null;
	lastName: string;
	gender: string;
	role: string;
	province: string;
	barangay: string;
	municipality: string;
	password: string;
	dateOfBirth: string;
	studentIdentificationId: number;
	email: string;
	studentIdentification?: TStudentIdentification;
};

export type TCreateUserParams = Omit<TUser, "id" | "studentIdentification">;

export type TCreatedUser = Pick<
	TUser,
	| "firstName"
	| "lastName"
	| "role"
	| "studentIdentificationId"
	| "email"
	| "studentIdentification"
>;

export type TLoginUserParams = {
	studentId: string;
	password: string;
};
export type TLoggedInUser = Pick<
	TUser,
	| "firstName"
	| "lastName"
	| "role"
	| "studentIdentificationId"
	| "email"
	| "studentIdentification"
	| "id"
>;
export type TTokenDetails = Pick<
	TUser,
	"firstName" | "lastName" | "role" | "studentIdentificationId" | "email"
> & {
	iat: number;
	exp: number;
};

export type TGetUsersParams = {
	skip: number;
	take: number;
	yearLevel?: number;
	blockId?: number;
	fullNameOrStudentId?: string;
};

export type TGetUsers = {
	id: number;
	firstName: string;
	middleName: string;
	lastName: string;
	role: string;
	gender: string;
	province: string;
	municipality: string;
	barangay: string;
	email: string;
	studentIdentification: {
		yearLevel: number;
		id: number;
		studentId: string;
		block: {
			id: number;
			name: string;
		};
	};
};
