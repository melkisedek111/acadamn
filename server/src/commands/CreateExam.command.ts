import { CommandHandler } from "../types/interfaces/CommandHandler";
import { TCreateExamParams, TExam } from "../types/types/exam.type";
import ExamModel from "../models/Exam";

export class CreateExamCommand implements CommandHandler<TCreateExamParams, TExam> {
	async execute(params: TCreateExamParams): Promise<TExam> {
                const examModel = new ExamModel();
                
                const getExamByTitle = await examModel.GetExamByParams({ title: params.title });

                if (getExamByTitle) throw new Error("Exam title is already exists.");

                
                const getExamByDateAndTime = await examModel.GetExamByDateAndTime({ scheduleDate: params.scheduleDate, startTime: params.startTime, endTime: params.endTime });
                if (getExamByDateAndTime) throw new Error("Subject day and time is overlapping.");

                const newExam = await examModel.CreateExam(params);

                return newExam;
        }
}
