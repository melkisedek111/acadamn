import { PrismaClient } from "@prisma/client";
import { prismaClient } from "../server";
import PrismaClientHelper from "../db/prisma-client.helper";
import {
	TCreateExamParams,
	TExam,
	TGetExamByDateAndTimeParams,
	TGetExamByParams,
	TGetExamsWithCount,
	TUpdateExamParams,
} from "../types/types/exam.type";
import {
	TCreateRoomParams,
	TGetRoomByParams,
	TRoom,
} from "../types/types/room.type";

class RoomModel extends PrismaClientHelper {
	private prisma: PrismaClient;

	constructor() {
		super();
		this.prisma = prismaClient;
	}

	/**
	 * This function is used to create new room
	 * Updated by: Mel Ubalde @ Friday, March 29 26, 2024 3:49 PM
	 * @param params
	 * @returns TRoom | null
	 */
	async CreateRoom(params: TCreateRoomParams): Promise<TRoom> {
		return await this.prismaQueryHandler<TRoom>(async () => {
			try {
				return await this.prisma.room.create({
					data: params,
					select: {
						id: true,
						name: true,
					},
				});
			} catch (error: any) {
				console.log(error.message);
				throw new Error("Failed to create a room");
			}
		}, "CreateRoom");
	}

	/**
	 * This function is used to get the exam
	 * Updated by: Mel Ubalde @ Friday, March 29 26, 2024 3:49 PM
	 * @param params
	 * @returns TUser| null
	 */
	async GetRoomByParams(params: TGetRoomByParams): Promise<TRoom | null> {
		return await this.prismaQueryHandler<TRoom | null>(async () => {
			try {
				return await this.prisma.room.findFirst({
					where: params,
				});
			} catch {
				throw new Error("Failed to get a room");
			}
		}, "GetRoomByParams");
	}

	/**
	 * This function is used to get the exam
	 * Updated by: Mel Ubalde @ Friday, March 29 26, 2024 3:49 PM
	 * @param params
	 * @returns TUser| null
	 */
	async GetRoomWithSubjectCounts(params: TGetRoomByParams): Promise<TRoom | null> {
		return await this.prismaQueryHandler<TRoom | null>(async () => {
			try {
				return await this.prisma.room.findFirst({
					include: {
						
					}
				});
			} catch {
				throw new Error("Failed to get a room");
			}
		}, "GetRoomByParams");
	}
}

export default RoomModel;
