"use server";


import path from "path";
import { writeFile } from "fs/promises";
import { fetchApi } from "@/helpers/fetch";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import fs from "fs";
import { handleUploadImage } from "@/helpers/handle-upload-files";

export type TExamItem = {
	id: number;
	itemCodeId: string;
	examId: number;
	itemType: string;
	question: string;
	hasCode: boolean;
	code: string;
	codeLanguage: string;
	optionType: string;
	options: string[];
	answers: string[];
	isDeleted?: boolean;
	isActive?: boolean;
	images?: any;
};

export type TCreateExamItemParams = Omit<TExamItem, "id">;
export type TUpdateExamItemParams = Partial<TExamItem>;

export async function createExamItem(params: TCreateExamItemParams, images: { imageCount: number; formData: FormData }) {
	const imageNames = await handleUploadImage(images);
	const createdExamItem = await fetchApi<TExamItem>("/examItem/create", {
		method: "POST",
		body: JSON.stringify({...params, images: imageNames}),
	});

	revalidatePath(`/add-exam-item/${params.examId}`);

	return createdExamItem;
}

export async function updateExamItem(params: TUpdateExamItemParams, images: { imageCount: number; formData: FormData }) {
	const imageNames = await handleUploadImage(images);
	const updatedExamItem = await fetchApi<TExamItem>("/examItem/update", {
		method: "POST",
		body: JSON.stringify({...params, images: imageNames}),
	});

	revalidatePath(`/add-exam-item/${params.examId}`);

	return updatedExamItem;
}

export async function getExamItems(examId: number){
	const examItems = await fetchApi<TExamItem[]>(`/examItem/get-exam-items?examId=${examId}`);
	revalidatePath(`/add-exam-item/${examId}`);
	if (examItems) {
		if ("error" in examItems) {
			return []
		}
	}

	return examItems;
}

export async function deleteExamItem(id: number, examId: number){
	const deleteExamItem = await fetchApi<any>("/examItem/hard-delete", {
		method: "POST",
		body: JSON.stringify({id}),
	});

	revalidatePath(`/add-exam-item/${examId}`);

	for(const filename of deleteExamItem) {
		const imagePath = path.join(process.cwd(), 'public/exam-item/', filename);
		await fs.promises.access(imagePath, fs.constants.F_OK);
		await fs.promises.unlink(imagePath);
	}

	return deleteExamItem;
}

export async function deleteSpecificExamItemImage(id: number, imageName: string, examId: number){
	const imageDeleted = await fetchApi<string>("/examItem/delete-image", {
		method: "POST",
		body: JSON.stringify({id, imageName}),
	});

	if (typeof imageDeleted === "string") {
		const imagePath = path.join(process.cwd(), 'public/exam-item/', imageDeleted);
		await fs.promises.access(imagePath, fs.constants.F_OK);
		await fs.promises.unlink(imagePath);
	}
	revalidatePath(`/add-exam-item/${examId}`);
	return imageDeleted;
}