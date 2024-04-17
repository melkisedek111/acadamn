import { CommandHandler } from "../types/interfaces/CommandHandler";
import { TUpdateSubjectParams, TSubject } from "../types/types/subject.types";
import SubjectModel from "../models/Subject";

export class UpdateSubjectCommand implements CommandHandler<TUpdateSubjectParams, TSubject> {
	async execute(params: TUpdateSubjectParams): Promise<TSubject> {
                const subjectModel = new SubjectModel();
                
                const subject = await subjectModel.GetSubjectByParams({ id: params.id });

                if (!subject) throw new Error("Subject does not exists.");

                if(subject.name !== params.name) {
                    const subjectByName = await subjectModel.GetSubjectByParams({ name: params.name });
                    if(subjectByName) throw new Error("Subject name does already exists");
                }

                if(subject.code !== params.code) {
                    const subjectByCode = await subjectModel.GetSubjectByParams({ code: params.code });
                    if(subjectByCode) throw new Error("Subject code does already exists");
                }

                if(subject.day.sort().join("") !== [...params.day].sort().join("") || subject.startTime !== params.startTime || subject.endTime !== params.endTime) {
                    const getSubjectByDayAndStartTime = await subjectModel.GetSubjectByDayAndTime({ day: params.day, startTime: params.startTime, endTime: params.endTime, id: params.id });
                    if (getSubjectByDayAndStartTime) throw new Error("Subject day and time is overlapping.");
                }

                const updateSubject = await subjectModel.UpdateSubject(params);

                return updateSubject;
        }
}
