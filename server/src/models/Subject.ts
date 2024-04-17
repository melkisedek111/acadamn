import { PrismaClient } from "@prisma/client";
import { prismaClient } from "../server";
import PrismaClientHelper from "../db/prisma-client.helper";
import {
	TCreateSubjectParams,
	TGetSubjectByDayAndTimeParams,
	TSubject,
	TUpdateSubjectParams,
} from "../types/types/subject.types";
import { Subject } from "@prisma/client";
class SubjectModel extends PrismaClientHelper {
	private prisma: PrismaClient;

	constructor() {
		super();
		this.prisma = prismaClient;
	}

	/**
	 * This function is used to create new subject
	 * Updated by: Mel Ubalde @ Friday, March 29 26, 2024 3:49 PM
	 * @param params
	 * @returns TUser| null
	 */
	async CreateSubject(params: TCreateSubjectParams): Promise<TSubject> {
		return await this.prismaQueryHandler<TSubject>(async () => {
			try {
				return await this.prisma.subject.create({
					data: params,
				});
			} catch (error: any) {
				console.log(error.message);
				throw new Error("Failed to create a subject");
			}
		}, "CreateSubject");
	}

	/**
	 * This function is used to get the subject
	 * Updated by: Mel Ubalde @ Friday, March 29 26, 2024 3:49 PM
	 * @param params
	 * @returns TUser| null
	 */
	async GetSubjectByParams(
		params: Partial<Omit<TSubject, "day">>
	): Promise<TSubject | null> {
		return await this.prismaQueryHandler<TSubject | null>(async () => {
			try {
				return await this.prisma.subject.findFirst({
					where: params,
				});
			} catch {
				throw new Error("Failed to get a subject");
			}
		}, "GetSubjectByParams");
	}

	/**
	 * This function is used to get the subject
	 * Updated by: Mel Ubalde @ Friday, March 29 26, 2024 3:49 PM
	 * @param params
	 * @returns TUser| null
	 */
	async GetSubjectByDayAndTime(params: TGetSubjectByDayAndTimeParams): Promise<TSubject | null> {
		return await this.prismaQueryHandler<TSubject | null>(async () => {
			try {
				const where = {...(params.id ? {id: { not: params.id }} : {})};

				return await this.prisma.subject.findFirst({
					where: {
						...where,
						AND: [
							{
								OR: [
									{
										day: {
											hasSome: params.day,
										},
									},
									{
										day: {
											hasEvery: params.day,
										},
									},
								]
							},
							{
								OR: [
									{
										AND: [
											{
												startTime: {
													lt: params.startTime,
												},
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
												endTime: {
													gt: params.endTime,
												},
											},
										]
									},
								],
							},
						],
					},
				});
			} catch {
				throw new Error("Failed to get a subject");
			}
		}, "GetSubjectByParams");
	}

	/**
	 * This function is used to get the subject
	 * Updated by: Mel Ubalde @ Friday, March 29 26, 2024 3:49 PM
	 * @param params
	 * @returns TUser| null
	 */
	async GetSubjects(): Promise<TSubject[]> {
		return await this.prismaQueryHandler<TSubject[]>(async () => {
			try {
				return await this.prisma.subject.findMany({
					orderBy: [
						{
							id: "desc"
						}
					]
				});
			} catch {
				throw new Error("Failed to get a list of subjects");
			}
		}, "GetSubjects");
	}

	/**
	 * This function is used to get the subject
	 * Updated by: Mel Ubalde @ Friday, March 29 26, 2024 3:49 PM
	 * @param params
	 * @returns TUser| null
	 */
	async UpdateSubject(params: Partial<TUpdateSubjectParams>): Promise<TSubject> {
		const { id, ...otherParams } = params;
		return await this.prismaQueryHandler<TSubject>(async () => {
			try {
				return await this.prisma.subject.update({
					where: {
						id: params.id
					},
					data: {
						...otherParams
					}
				});
			} catch {
				throw new Error("Failed to get a list of subjects");
			}
		}, "UpdateSubject");
	}
}

export default SubjectModel;
