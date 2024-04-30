import ExamModel from "../models/Exam";
import { QueryHandler } from "../types/interfaces/QueryHandler";
import { TGetExams } from "../types/types/exam.type";
import moment from "moment";
import { TExamItem } from "../types/types/examItem.type";
import ExamItemModel from "../models/ExamItem";

export class GetExamItemQuery implements QueryHandler<{ examId: number }, TExamItem[]> {
	async execute(params: { examId: number }): Promise<TExamItem[]> {
		const examItemModel = new ExamItemModel();
        const examItems = await examItemModel.GetExamItemsByParams({ examId: params.examId });
        return examItems;
	}
}
