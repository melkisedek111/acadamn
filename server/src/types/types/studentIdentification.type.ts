export type TStudentIdentification = {
    id: number;
    studentId: string;
    isRegistered: boolean;
}

export type TCreateStudentIdentificationParams = Pick<TStudentIdentification, "studentId" | "isRegistered">;
export type TCreatedStudentIdentification = Pick<TStudentIdentification, "studentId" | "isRegistered">;
export type TCheckStudentIdentificationIdParams =   Pick<TStudentIdentification, "studentId">;
export type TUpdateRegisteredStudentIdentificationParams = Pick<TStudentIdentification, "id">;