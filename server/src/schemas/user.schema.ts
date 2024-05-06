import { z } from "zod";

export const createUserSchema = z.object({
	firstName: z
		.string({
			required_error: "First name is required.",
		})
		.min(2, { message: "Must be 2 or more characters long" })
		.trim(),
	middleName: z
		.string()
		.min(2, { message: "Must be 2 or more characters long" })
		.trim()
		.optional(),
	lastName: z
		.string({
			required_error: "Last name is required.",
		})
		.min(2, { message: "Must be 2 or more characters long" })
		.trim(),
	gender: z.string({
		required_error: "Gender is required.",
	}),
	dateOfBirth: z.string({
		required_error: "Date of birth is required.",
	}),
	studentIdentificationId: z.number({
		required_error: "Student ID is required.",
	}),
	barangay: z.string({
		required_error: "Barangay is required.",
	}),
	municipality: z.string({
		required_error: "Municipality is required.",
	}),
	province: z.string({
		required_error: "Province is required.",
	}),
	password: z
		.string({
			required_error: "Password is required.",
		})
		.min(8, { message: "Password must 8 or more characters long" })
		.trim(),
	email: z
		.string({
			required_error: "Email is required.",
		})
		.email({
			message: "Valid email is required.",
		})
		.trim(),
});

export const loginUserSchema = z.object({
	studentId: z
		.string({
			required_error: "Student ID is required.",
		})
		.trim(),
	password: z
		.string({
			required_error: "Password is required.",
		})
		.trim(),
});

export const getUsersSchema = z.object({
	skip: z.number({
		required_error: "Pagination is required.",
	}),
	take: z.number({
		required_error: "Pagination is required.",
	}),
	yearLevel: z.number().optional(),
	blockId: z.number().optional(),
	fullNameOrStudentId: z.string().trim().optional(),
});
