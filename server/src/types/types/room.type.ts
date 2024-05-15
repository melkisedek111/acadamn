import { TSubject } from "./subject.types";

export type TRoom = {
    id: number;
    name: string;
}

export type TCreateRoomParams = Pick<TRoom, "name">;
export type TGetRoomByParams = Partial<TRoom>;
export type TUpdateRoomParams = Pick<TRoom, "id" | "name">;
export type TGetRoomsAndSubjectCounts = {
    id: number;
    name: string;
    _count: {
        subjectRoomAssignment: number;
    },
}
export type TGetRoomsAndAssignedSubjects = {
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
    subject: TSubject;
    roomId: number;
    room: TRoom;
    endTime: string;
    startTime: string;
    day: string[]
}

export type TUpdateSubjectRoomScheduleParams = Omit<TSubjectRoomAssignment, "subject" | "room">;