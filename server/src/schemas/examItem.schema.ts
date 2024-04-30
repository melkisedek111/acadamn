import { z } from "zod";

export const createExamItemSchema = z.object({
	itemCodeId: z.string({
		required_error: "Item code ID is required.",
	}),
	examId: z.number({
		required_error: "Exam ID is required.",
	}),
	itemType: z.string({
		required_error: "Item type is required.",
	}),
	question: z.string({
		required_error: "Question is required.",
	}),
	hasCode: z.boolean().optional(),
	code: z
		.string({
			required_error: "Code must be string",
		})
		.optional(),
	codeLanguage: z
		.string({
			required_error: "Code language must be string",
		})
		.optional(),
	optionType: z.string({
		required_error: "Option type is required",
	}),
	options: z
		.string({
			required_error: "Options must be string",
		})
		.array()
		.optional(),
	answers: z
		.string({
			required_error: "Answer is required",
		})
		.array(),
	image: z
		.string({
			required_error: "Image must be string",
		})
		.array()
		.optional(),
});

export const getExamItemsSchema = z.object({
	examId: z.string({
		required_error: "Exam ID is required",
	}),
});
