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
	studentIdentification?: TStudentIdentification
};

export type TCreateUserParams = Omit<TUser, "id" | "studentIdentification">;

export type TCreatedUser = Pick<
	TUser,
	"firstName" | "lastName" | "role" | "studentIdentificationId" | "email" | "studentIdentification"
>;

export type TLoginUserParams = {
	studentId: string;
	password: string
};
export type TLoggedInUser = Pick<
	TUser,
	"firstName" | "lastName" | "role" | "studentIdentificationId" | "email" | "studentIdentification" | "id"
>;
export type TTokenDetails = Pick<
	TUser,
	"firstName" | "lastName" | "role" | "studentIdentificationId" | "email"
> & {
	iat: number;
	exp: number;
};


