import { CommandHandler } from "../types/interfaces/CommandHandler";
import { TCreateSubject, TCreateSubjectParams, TSubject } from "../types/types/subject.types";
import SubjectModel from "../models/Subject";

export class CreateSubjectCommand implements CommandHandler<TCreateSubjectParams, TSubject> {
	async execute(params: TCreateSubjectParams): Promise<TCreateSubject> {
                const subjectModel = new SubjectModel();
                
                const getSubjectByName = await subjectModel.GetSubjectByParams({ name: params.name });

                if (getSubjectByName) throw new Error("Subject name is already exists.");

                const getSubjectByCode = await subjectModel.GetSubjectByParams({ code: params.code });
                if (getSubjectByCode) throw new Error("Subject code is already exists.");

                const getSubjectByDayAndStartTime = await subjectModel.GetSubjectByDayAndTime({ day: params.day, startTime: params.startTime, endTime: params.endTime });
                if (getSubjectByDayAndStartTime) throw new Error("Subject day and time is overlapping.");

                const newSubject = await subjectModel.CreateSubject(params);

                return newSubject;
        }
}
