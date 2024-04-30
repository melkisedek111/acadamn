"use server";
import { fetchApi } from "@/helpers/fetch";
import { TSubject } from "../subjects/action";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type TExam = {
    id: number;
    userId: number;
    subjectId: number;
    subject: TSubject;
    description: string;
    title: string;
    scheduleDate: Date;
    startTime: string;
    type: string;
    endTime: string;
    isActive: boolean;
}

export type TGetExams = Pick<TExam, "id" | "title" | "type" | "isActive" | "description"> & {
    scheduleDate: string;
    scheduleTime: string;
    noOfItems: number;
    duration: number;
    subject: string;
    studentCompleted: number;
};

export type TCreateExamParams = Omit<TExam, "id" | "subject" | "isActive" | "userId">;

export async function createExam(params: TCreateExamParams) {
    const createdExam = await fetchApi<TExam>("/exam/create", {
		method: "POST",
		body: JSON.stringify(params),
	});

	revalidatePath("/exams");

	return createdExam;
}

export async function getExams() {
	const exams = await fetchApi<TGetExams[]>("/exam/get-exams", {
		method: "GET",
	});

    if("error" in exams) {
        return [];
    }

    return exams;
}
