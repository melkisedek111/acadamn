export type TSubject = {
    id: number;
    name: string;
    code: string;
    description: string;
    day: string[];
    startTime: string;
    endTime: string;
    isActive: boolean;
}

export type TCreateSubjectParams = Omit<TSubject, "id">;

export type TUpdateSubjectParams = TSubject;

export type TCreateSubject = TSubject;

export type TGetSubject = TSubject;

export type TGetSubjectByDayAndTimeParams = Pick<TSubject, "day" | "startTime" | "endTime"> & { id?: number };

export type TSetSubjectStatusParams = Pick<TSubject, "id" >;