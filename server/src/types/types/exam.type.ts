import { TSubject } from "./subject.types";

export type TExam = {
    id: number;
    userId: number;
    subjectId: number;
    subject: TSubject;
    description: string;
    title: string;
    scheduleDate: Date;
    startTime: string;
    type: string;
    endTime: string;
    isActive: boolean;
}

export type TCreateExamParams = Omit<TExam, "id" | "subject" | "isActive">;
export type TGetExamByParams = Partial<Omit<TExam, "subject">>;

export type TGetExamByDateAndTimeParams = Pick<TExam, "scheduleDate" | "startTime" | "endTime"> & { id?: number };
