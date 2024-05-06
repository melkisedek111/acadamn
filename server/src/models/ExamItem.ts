import { PrismaClient, ExamItem } from "@prisma/client";
import { prismaClient } from "../server";
import PrismaClientHelper from "../db/prisma-client.helper";
import { TCreateExamItemParams, TExamItem, TGetExamItemByParams, TUpdateExamItemParams } from "../types/types/examItem.type";

class ExamItemModel extends PrismaClientHelper {
	private prisma: PrismaClient;

	constructor() {
		super();
		this.prisma = prismaClient;
	}

    /**
	 * This function is used to create new exam item
	 * Updated by: Mel Ubalde @ Friday, March 29 26, 2024 3:49 PM
	 * @param params
	 * @returns TExamItem | null
	 */
	async CreateExamItem(params: TCreateExamItemParams): Promise<TExamItem> {
		return await this.prismaQueryHandler<TExamItem>(async () => {
			try {
				return await this.prisma.examItem.create({
					data: params
				});
			} catch (error: any) {
				console.log(error.message);
				throw new Error("Failed to create a exam item");
			}
		}, "CreateExamItem");
	}

	/**
	 * This function is used to get the exam item by params
	 * Updated by: Mel Ubalde @ Friday, March 29 26, 2024 3:49 PM
	 * @param params
	 * @returns TExamItem| null
	 */
	async GetExamItemByParams(params: TGetExamItemByParams): Promise<TExamItem | null> {
		return await this.prismaQueryHandler<TExamItem | null>(async () => {
			try {
				return await this.prisma.examItem.findFirst({
					where: params,
				});
			} catch {
				throw new Error("Failed to get a exam");
			}
		}, "GetExamItemByParams");
	}

	/** sone-097
	 * This function is used to get the exam item by params
	 * Updated by: Mel Ubalde @ Friday, March 29 26, 2024 3:49 PM
	 * @param params
	 * @returns TExamItem| null
	 */
	async GetExamItemsByParams(params: TGetExamItemByParams): Promise<TExamItem[]> {
		return await this.prismaQueryHandler<TExamItem[]>(async () => {
			try {
				return await this.prisma.examItem.findMany({
					where: params,
					orderBy: [
						{
							id: "asc"
						}
					]
				});
			} catch {
				throw new Error("Failed to get a exam items");
			}
		}, "GetExamItemsByParams");
	}

		/**
	 * This function is used to get the subject
	 * Updated by: Mel Ubalde @ Friday, March 29 26, 2024 3:49 PM
	 * @param params
	 * @returns TUser| null
	 */
	async UpdateExamItem(params: TUpdateExamItemParams): Promise<TExamItem> {
		const { id, ...otherParams } = params;
		return await this.prismaQueryHandler<TExamItem>(async () => {
			try {
				return await this.prisma.examItem.update({
					where: {
						id: params.id
					},
					data: {
						...otherParams
					}
				});
			} catch {
				throw new Error("Failed to update of exam item");
			}
		}, "UpdateExamItem");
	}

	/**
	 * This function is used to get the subject
	 * Updated by: Mel Ubalde @ Friday, March 29 26, 2024 3:49 PM
	 * @param params
	 * @returns TUser| null
	 */
	async DeleteExamItem(params: { id: number }): Promise<TExamItem> {
		return await this.prismaQueryHandler<TExamItem>(async () => {
			try {
				return await this.prisma.examItem.delete({
					where: {
						id: params.id
					},
				});
			} catch {
				throw new Error("Failed to delete exam item");
			}
		}, "DeleteExamItem");
	}
}

export default ExamItemModel;
