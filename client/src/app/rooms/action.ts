"use server";
import { fetchApi } from "@/helpers/fetch";
import { revalidatePath } from "next/cache";

export type TRoom = {
    id: number;
    name: string;
}

export type TCreateRoomParams = Pick<TRoom, "name">;

export async function createRoom(params: TCreateRoomParams) {
    const room = await fetchApi<TRoom>("/room/create", {
		method: "POST",
		body: JSON.stringify(params),
	});
    
    revalidatePath("/rooms");

    return room;
}