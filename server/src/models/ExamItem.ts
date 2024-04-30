import { PrismaClient, ExamItem } from "@prisma/client";
import { prismaClient } from "../server";
import PrismaClientHelper from "../db/prisma-client.helper";
import { TCreateExamItemParams, TExamItem, TGetExamItemByParams } from "../types/types/examItem.type";

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

		/**
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
}

export default ExamItemModel;
