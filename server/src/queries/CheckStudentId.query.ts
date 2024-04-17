import StudentIdentificationModel from "../models/StudentIdentification";
import { Task } from "../models/Task";
import UserModel from "../models/User";
import { QueryHandler } from "../types/interfaces/QueryHandler";
import { TCheckStudentIdentificationIdParams, TStudentIdentification } from "../types/types/studentIdentification.type";


export class CheckStudentIdQuery  implements QueryHandler<TCheckStudentIdentificationIdParams, TStudentIdentification> {
    async execute(params: TCheckStudentIdentificationIdParams): Promise<TStudentIdentification> {
        const studentIdentificationModel = new StudentIdentificationModel();
        
        const studentIdentification = await studentIdentificationModel.GetStudentIdentification({studentId: params.studentId});

        if(!studentIdentification) throw new Error("Student ID does not exists");

        const { studentId, id, isRegistered } = studentIdentification;

        // if (isRegistered) throw new Error("Student ID is already registered");

        return { studentId, id, isRegistered };
    }
}