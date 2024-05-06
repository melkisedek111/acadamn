import { CommandHandler } from "../types/interfaces/CommandHandler";
import { TExam, TUpdateExamParams } from "../types/types/exam.type";
import ExamModel from "../models/Exam";

export class UpdateExamCommand implements CommandHandler<TUpdateExamParams, TExam> {
	async execute(params: TUpdateExamParams): Promise<TExam> {
                const examModel = new ExamModel();

                const getExam = await examModel.GetExamByParams({ id: params.id });
                if (!getExam) throw new Error("Exam does not exists.");
                
                if(getExam.title !== params.title) {
                    const getExamByTitle = await examModel.GetExamByParams({ title: params.title });
                    if (getExamByTitle) throw new Error("Exam title is already exists.");
                }

                if(params.scheduleDate && params.startTime && params.endTime) {
                    if(getExam.scheduleDate !== params.scheduleDate || getExam.startTime !== params.startTime || getExam.endTime !== params.endTime) {
                        const getExamByDateAndTime = await examModel.GetExamByDateAndTime({ scheduleDate: params.scheduleDate, startTime: params.startTime, endTime: params.endTime });
                        if (getExamByDateAndTime) throw new Error("Exam day and time is overlapping.");
                    }
                }

                const newExam = await examModel.UpdateExam(params);
                if(!newExam) throw new Error("Exam update failed.");

                return newExam;
        }
}
