"use server";
import { fetchApi } from "@/helpers/fetch";
import { TStudentIdentification } from "./page";
import { redirect } from "next/navigation";

export type TCreateUserAccount = {
	studentIdentificationId: number;
	firstName: string;
	middleName?: string;
	lastName: string;
	gender: "male" | "female";
	dateOfBirth: string;
	barangay: string;
	province: string;
	municipality: string;
	password: string;
	email: string;
};

export async function checkStudentId(values: { studentId: string }) {
	const response = await fetchApi<TStudentIdentification>("/student-identification/check-student-id", {
		method: "POST",
		body: JSON.stringify(values),
	});

	return response;
}
type TCreateAccount = {
	firstName: string,
	lastName: string,
	role: string,
	studentIdentificationId: number,
	studentIdentification: {
	  id: number,
	  studentId: string,
	  isRegistered: boolean,
	},
	email: string
  }
export async function createUserAccount(params: TCreateUserAccount) {
    return await fetchApi<TCreateAccount>("/user/create", {
        method: "POST",
        body: JSON.stringify(params),
    });
}
