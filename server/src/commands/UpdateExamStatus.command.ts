import { CommandHandler } from "../types/interfaces/CommandHandler";
import { TExam } from "../types/types/exam.type";
import ExamModel from "../models/Exam";

export class UpdateExamStatusCommand implements CommandHandler<{ id: number }, TExam> {
	async execute(params: { id: number }): Promise<TExam> {
            const examModel = new ExamModel();

            const getExam = await examModel.GetExamByParams({ id: params.id });
            if (!getExam) throw new Error("Exam does not exists.");
            
            const newExam = await examModel.UpdateExam({id: params.id, isActive: !getExam.isActive});
            if(!newExam) throw new Error("Exam update failed.");

            return newExam;
        }
}
