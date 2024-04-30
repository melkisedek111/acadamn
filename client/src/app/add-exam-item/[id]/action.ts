"use server";

import path from "path";
import { writeFile } from "fs/promises";
import { fetchApi } from "@/helpers/fetch";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

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
	images?: any;
};

export type TCreateExamItemParams = Omit<TExamItem, "id">;

export async function createExamItem(
	params: TCreateExamItemParams,
	images: { imageCount: number; formData: FormData }
) {
	try {
		const imageNames = [];

		for (let index = 0; images.imageCount > index; index++) {
			const imageCount = index + 1;
			const file = images.formData.get("image-" + imageCount) as any;

			if (file) {
				// Convert the file data to a Buffer
				const buffer = Buffer.from(await file.arrayBuffer());
				// Get current timestamp
				const timestamp = Date.now();
				const extension = file.type.split("/")[1];

				// Generate file name using timestamp
				const fileName = `EXAM_ITEM_${timestamp}.${extension}`;

				await writeFile(
					path.join(process.cwd(), "public/exam-item/" + fileName),
					buffer
				);

				imageNames.push(fileName);
			}
		}

		const createdExamItem = await fetchApi<TExamItem>("/examItem/create", {
		    method: "POST",
		    body: JSON.stringify({...params, images: imageNames}),
		});

		revalidatePath(`/add-exam-item/${params.examId}`);

        return createdExamItem;

	} catch (error) {
		return {
			error: "File Upload",
			details: [{ message: "Can't upload images" }],
		};
	}
}

export async function getExamItems(examId: number){
	const examItems = await fetchApi<TExamItem[]>(`/examItem/get-exam-items?examId=${examId}`);

	if("error" in examItems) {
		revalidatePath(`/exams`);
		redirect(`/exams`);
	}

	return examItems;
}