import { z } from "zod";

export const createExamSchema = z.object({
	subjectId: z.number({
		required_error: "Subject for the exam is required.",
	}),
	title: z.string({
		required_error: "Exam title is required.",
	}),
	description: z.string({
		required_error: "Exam description is required.",
	}),
	scheduleDate: z.string({
		required_error: "Exam schedule date is required.",
	}).datetime({message: "Exam must be a datetime format."}),
	startTime: z.string({
		required_error: "Exam start time is required",
	}),
	endTime: z.string({
		required_error: "Exam end time is required.",
	}),
	type: z.string({
		required_error: "Exam type is required.",
	}),
});

export const updateExamSchema = z.object({
	id: z.number({
		required_error: "ID for the exam is required.",
	}),
	subjectId: z.number({
		required_error: "Subject for the exam is required.",
	}),
	title: z.string({
		required_error: "Exam title is required.",
	}),
	description: z.string({
		required_error: "Exam description is required.",
	}),
	scheduleDate: z.string({
		required_error: "Exam schedule date is required.",
	}).datetime({message: "Exam must be a datetime format."}),
	startTime: z.string({
		required_error: "Exam start time is required",
	}),
	endTime: z.string({
		required_error: "Exam end time is required.",
	}),
	type: z.string({
		required_error: "Exam type is required.",
	}),
});

export const updateExamStatusSchema = z.object({
	id: z.number({
		required_error: "ID for the exam is required.",
	})
});