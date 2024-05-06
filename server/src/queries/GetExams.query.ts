import ExamModel from "../models/Exam";
import { QueryHandler } from "../types/interfaces/QueryHandler";
import { TGetExams } from "../types/types/exam.type";
import moment from "moment";

export class GetExamQuery implements QueryHandler<unknown, TGetExams[]> {
	async execute(): Promise<TGetExams[]> {
		const examModel = new ExamModel();
		const exams = await examModel.GetExams();
		const listExams: TGetExams[] = [];

		for (const exam of exams) {
			const date = moment(exam.scheduleDate).format("MMMM D, YYYY");

			const startTime = moment(exam.startTime, "hh:mm A");
			const endTime = moment(exam.endTime, "hh:mm A");

			// Calculate the duration in minutes
			const durationInMinutes = endTime.diff(startTime, "minutes");

			listExams.push({
				id: exam.id,
				title: exam.title,
                subject: exam.subject.name,
				subjectId: exam.subject.id,
				type: exam.type,
				isActive: exam.isActive,
                description: exam.description,
				scheduleDate: date,
				startTime: exam.startTime,
				endTime: exam.endTime,
				scheduleTime: `${startTime.format('hh:mm A')} - ${endTime.format('hh:mm A')}`,
				noOfItems: exam._count.ExamItem,
				studentCompleted: exam._count.UserExam,
                duration: durationInMinutes
			});
		}

		return listExams;
	}
}
