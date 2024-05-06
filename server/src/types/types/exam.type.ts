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
export type TUpdateExamParams = Partial<Omit<TExam, "subject">>;
export type TGetExamByParams = Partial<Omit<TExam, "subject">>;

export type TGetExams = Pick<TExam, "id" | "title" | "type" | "isActive" | "description" | "startTime" | "endTime"> & {
    scheduleDate: string;
    scheduleTime: string;
    noOfItems: number;
    duration: number;
    subject: string;
    subjectId: number;
    studentCompleted: number;
};

export type TGetExamsWithCount = TExam & {
    _count: { UserExam: number; ExamItem: number} 
}

export type TGetExamByDateAndTimeParams = Pick<TExam, "scheduleDate" | "startTime" | "endTime"> & { id?: number };
