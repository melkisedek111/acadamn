import { z } from "zod";

export const createSubjectSchema = z.object({
	name: z.string({
		required_error: "Subject name is required.",
	}),
	code: z.string({
		required_error: "Subject code is required.",
	}),
	description: z.string({
		required_error: "Subject description is required.",
	}),
	day: z.array(z.string()).refine((value) => value.some((item) => item), {
		message: "You have to select at least one day for the subject.",
	}),
	startTime: z.string({
		required_error: "Subject start time is required",
	}),
	endTime: z.string({
		required_error: "Subject end time is required.",
	}),
});

export const updateSubjectSchema = z.object({
	id: z.number({
		required_error: "Subject id is required.",
	}),
	name: z.string({
		required_error: "Subject name is required.",
	}),
	code: z.string({
		required_error: "Subject code is required.",
	}),
	description: z.string({
		required_error: "Subject description is required.",
	}),
	day: z.array(z.string()).refine((value) => value.some((item) => item), {
		message: "You have to select at least one day for the subject.",
	}),
	startTime: z.string({
		required_error: "Subject start time is required",
	}),
	endTime: z.string({
		required_error: "Subject end time is required.",
	}),
});

export const setSubjectStatusSchema = z.object({
	id: z.number({
		required_error: "Subject id is required.",
	})
});
