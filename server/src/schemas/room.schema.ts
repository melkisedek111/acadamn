import { z } from "zod";

export const createRoomSchema = z.object({
	name: z.string({
		required_error: "Room name is required.",
	}).trim()
});

export const updateRoomSchema = z.object({
	id: z.number({
		required_error: "Room ID is required.",
	}),
	name: z.string({
		required_error: "Room name is required.",
	}).trim()
});

export const subjectRoomAssignmentSchema = z.object({
    roomId: z.number({
        required_error: "Room is required.",
    }),
    subjectId: z.number({
        required_error: "Subject is required.",
    }),
    day: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: "You have to select at least one day for the subject.",
    }),
    startTime: z.string({
        required_error: "Subject start time is required.",
    }).min(1, {
        message: "Subject start time is required."
    }),
    endTime: z.string({
        required_error: "Subject end time is required.",
    }).min(1, {
        message: "Subject end time is required."
    }),
})

export const updateSubjectRoomScheduleSchema = z.object({
    id: z.number({
        required_error: "ID is required.",
    }),
    roomId: z.number({
        required_error: "Room is required.",
    }),
    subjectId: z.number({
        required_error: "Subject is required.",
    }),
    day: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: "You have to select at least one day for the subject.",
    }),
    startTime: z.string({
        required_error: "Subject start time is required.",
    }).min(1, {
        message: "Subject start time is required."
    }),
    endTime: z.string({
        required_error: "Subject end time is required.",
    }).min(1, {
        message: "Subject end time is required."
    }),
})