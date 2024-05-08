import { z } from "zod";

export const createRoomSchema = z.object({
	name: z.string({
		required_error: "Room name is required.",
	}).trim()
});