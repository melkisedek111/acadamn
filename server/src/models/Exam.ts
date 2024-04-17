import { PrismaClient } from "@prisma/client";
import { prismaClient } from "../server";
import PrismaClientHelper from "../db/prisma-client.helper";
import {
	TSubject,
	TUpdateSubjectParams,
} from "../types/types/subject.types";
import { TCreateExamParams, TExam, TGetExamByDateAndTimeParams, TGetExamByParams } from "../types/types/exam.type";

class ExamModel extends PrismaClientHelper {
	private prisma: PrismaClient;

	constructor() {
		super();
		this.prisma = prismaClient;
	}

	/**
	 * This function is used to create new exam
	 * Updated by: Mel Ubalde @ Friday, March 29 26, 2024 3:49 PM
	 * @param params
	 * @returns TExam| null
	 */
	async CreateExam(params: TCreateExamParams): Promise<TExam> {
		return await this.prismaQueryHandler<TExam>(async () => {
			try {
				return await this.prisma.exam.create({
					data: params,
					include: {
						subject: true,
					}
				});
			} catch (error: any) {
				console.log(error.message);
				throw new Error("Failed to create a exam");
			}
		}, "CreateExam");
	}

	/**
	 * This function is used to get the subject
	 * Updated by: Mel Ubalde @ Friday, March 29 26, 2024 3:49 PM
	 * @param params
	 * @returns TUser| null
	 */
	async GetExamByParams(
		params: TGetExamByParams
	): Promise<TSubject | null> {
		return await this.prismaQueryHandler<Omit<TExam, "userId"> | null>(async () => {
			try {
				return await this.prisma.exam.findFirst({
					where: params,
					include: {
						subject: true
					}
				});
			} catch {
				throw new Error("Failed to get a exam");
			}
		}, "GetExamByParams");
	}

		/**
	 * This function is used to get the subject
	 * Updated by: Mel Ubalde @ Friday, March 29 26, 2024 3:49 PM
	 * @param params
	 * @returns TUser| null
	 */
	async GetExamByDateAndTime(params: TGetExamByDateAndTimeParams): Promise<TExam | null>{
		return await this.prismaQueryHandler<TExam | null>(async () => {
			try {
				const where = {...(params.id ? {id: { not: params.id }} : {})};

				return await this.prisma.exam.findFirst({
					where: {
						...where,
						scheduleDate: params.scheduleDate,
						OR: [
							{
								AND: [
									{
										OR: [
											{
												startTime: {
													lt: params.startTime,
												},
											},
											{
												startTime: params.startTime,
											},
										]
									},
									{
										endTime: {
											gt: params.startTime,
										},
									},
								]
							},
							{
								AND: [
									{
										startTime: {
											lt: params.endTime,
										},
									},
									{
										OR: [
											{
												endTime: {
													gt: params.endTime,
												},
											},
											{
												endTime: params.endTime
											}
										]
									},
								]
							},
						],
					},
					include: {
						subject: true
					}
				});
			} catch {
				throw new Error("Failed to get a subject");
			}
		}, "GetSubjectByParams");
	}

}

export default ExamModel;
