"use server";
import { fetchApi } from "@/helpers/fetch";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect, RedirectType } from "next/navigation";

export type TSubject = {
	id: number;
	name: string;
	code: string;
	description: string;
	day: string[];
	startTime: string;
	endTime: string;
	isActive: boolean;
};

export type TCreateSubjectParams = Omit<TSubject, "id" | "isActive">;
export type TUpdateSubjectParams = Omit<TSubject, "isActive">;

export async function createSubject(params: TCreateSubjectParams) {
	const createdSubject = await fetchApi<TSubject>("/subject/create", {
		method: "POST",
		body: JSON.stringify(params),
	});

	revalidatePath("/subjects");

	return createdSubject;
}

export async function updateSubject(params: TUpdateSubjectParams) {
	const updatedSubject = await fetchApi<TSubject>("/subject/update-subject", {
		method: "POST",
		body: JSON.stringify(params),
	});

	revalidatePath("/subjects");
	
	return updatedSubject;
}

export async function setSubjectStatus(params: { id: number}) {
	const setSubjectStatus = await fetchApi<TSubject>("/subject/set-status", {
		method: "POST",
		body: JSON.stringify(params),
	});

	revalidatePath("/subjects");

	return setSubjectStatus;
}

export async function getSubjects() {
	const subjects = await fetchApi<TSubject[]>("/subject/get-subjects", {
		method: "GET",
	});

	return subjects;
}

