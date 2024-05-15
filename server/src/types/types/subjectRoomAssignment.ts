import { TRoom } from "./room.type";
import { TSubject } from "./subject.types";

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


export type TCreateSubjectRoomAssignmentParams = Omit<TSubjectRoomAssignment, "id" | "subject" | "room">;
export type TGetRoomAssignmentBySubjectAndScheduleParams = Pick<TSubjectRoomAssignment, "day" | "startTime" | "endTime" | "subjectId" | "roomId"> & {
    id?: number;
}
export type TGetSubjectAssignedRoomParams = Omit<TSubjectRoomAssignment, "subject" | "room" | "day">;