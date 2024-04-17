
export type TUserProfileToken = {
    studentIdentificationId: number,
    studentIdentification: {
      id: number,
      studentId: string,
      isRegistered: boolean,
      createdAt: string,
      updatedAt: string
    },
    firstName: string,
    lastName: string,
    role: string,
    email: string,
    id: number,
}