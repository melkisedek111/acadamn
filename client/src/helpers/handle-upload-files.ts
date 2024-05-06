import { writeFile } from "fs/promises";
import path from "path";

export const handleUploadImage = async (images: { imageCount: number; formData: FormData }): Promise<string[]> => {
    const imageNames: string[] = [];
	console.log(images)
    
    try {
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
    } catch (error) {
        console.log(error);
    }

    return imageNames;
}