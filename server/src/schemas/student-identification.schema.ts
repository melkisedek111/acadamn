import { z } from "zod";

export const createStudentIdentificationSchema = z.object({
	studentId: z
		.string({
			required_error: "Student ID is required.",
		})
		.trim(),
});
export const checkStudentIdentificationSchema = z.object({
	studentId: z
		.string({
			required_error: "Student ID is required.",
		})
		.trim(),
});
