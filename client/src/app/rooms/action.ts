"use server";
import { fetchApi } from "@/helpers/fetch";
import { revalidatePath } from "next/cache";
import { TSubject } from "../subjects/action";

export type TRoom = {
    id: number;
    name: string;
}
export type TCreateRoomParams = Pick<TRoom, "name">;
export type TUpdateRoomParams = Pick<TRoom, "id" | "name">;
export type TGetRoomsAndSubjectCounts = {
    id: number;
    name: string;
    _count: {
        subjectRoomAssignment: number;
    },
    subjectRoomAssignment: {
        id: number;
        subject: {
            id: number;
            name: string;
        },
        endTime: string;
        startTime: string;
        day: string[]
    }[]
}
export type TSubjectRoomAssignment = {
    id: number;
    subjectId: number;
    subject: TSubject,
    roomId: number;
    room: TRoom;
    day: string[],
    startTime: string;
    endTime: string;
}

export type TUpdateSubjectRoomScheduleParams = Omit<TSubjectRoomAssignment, "subject" | "room">;
export type TCreateSubjectRoomAssignmentParams = Omit<TSubjectRoomAssignment, "id" | "subject" | "room">;


export async function createRoom(params: TCreateRoomParams) {
    const room = await fetchApi<TRoom>("/room/create", {
		method: "POST",
		body: JSON.stringify(params),
	});
    
    revalidatePath("/rooms");

    return room;
}

export async function updateRoom(params: TUpdateRoomParams) {
    const updatedRoom = await fetchApi<TGetRoomsAndSubjectCounts>("/room/update", {
		method: "POST",
		body: JSON.stringify(params),
	});
    revalidatePath("/rooms");
    return updatedRoom;
}

export async function GetRoomsAndSubjectCountsQuery(params: any) {
    const room = await fetchApi<TGetRoomsAndSubjectCounts[]>("/room/get-rooms", {
		method: "POST",
		body: JSON.stringify(params),
	});
    
    return room;
}

export async function assignSubjectToRoomCommand(params: TCreateSubjectRoomAssignmentParams) {
    const room = await fetchApi<TSubjectRoomAssignment>("/room/subject-room-assignment", {
		method: "POST",
		body: JSON.stringify(params),
	});
    revalidatePath("/rooms");
    return room;
}


export async function updateSubjectSchedule(params: TUpdateSubjectRoomScheduleParams) {
    const room = await fetchApi<TSubjectRoomAssignment>("/room/update-subject-schedule", {
		method: "POST",
		body: JSON.stringify(params),
	});
    revalidatePath("/rooms");
    return room;
}

