export type TStudentIdentification = {
    id: number;
    studentId: string;
    isRegistered: boolean;
    blockId: number;
    yearLevel: number;
}

export type TCreateStudentIdentificationParams = Pick<TStudentIdentification, "studentId" | "isRegistered" | "blockId" | "yearLevel">;
export type TCreatedStudentIdentification = Pick<TStudentIdentification, "studentId" | "isRegistered" | "blockId" | "yearLevel">;
export type TCheckStudentIdentificationIdParams =   Pick<TStudentIdentification, "studentId">;
export type TUpdateRegisteredStudentIdentificationParams = Pick<TStudentIdentification, "id">;