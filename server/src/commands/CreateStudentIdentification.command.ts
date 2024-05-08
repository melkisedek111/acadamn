import { Task } from "../models/Task";
import UserModel from "../models/User";
import { CommandHandler } from "../types/interfaces/CommandHandler";
import StudentIdentificationModel from "../models/StudentIdentification";
import { TCreatedStudentIdentification, TCreateStudentIdentificationParams } from "../types/types/studentIdentification.type";

export class CreateStudentIdentificationCommand implements CommandHandler<TCreateStudentIdentificationParams, TCreatedStudentIdentification>
{
	async execute(params: TCreateStudentIdentificationParams): Promise<TCreatedStudentIdentification> {
        const studentIdentificationModel = new StudentIdentificationModel();

        const getStudentIdentification = await studentIdentificationModel.GetStudentIdentification({ studentId: params.studentId });
        if (getStudentIdentification) throw new Error("Student ID already exists");

        const createdStudentIdentification = await studentIdentificationModel.CreateStudentIdentification({ isRegistered: false, studentId: params.studentId, blockId: params.blockId, yearLevel: params.yearLevel });

		if (!createdStudentIdentification) throw new Error("Failed to create student identification");

		const { studentId, isRegistered, blockId, yearLevel } = createdStudentIdentification;

		return { studentId, isRegistered, blockId, yearLevel  };
	}
}
