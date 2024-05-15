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
	TGetRoomsAndSubjectCounts,
	TRoom,
	TUpdateRoomParams,
	TUpdateSubjectRoomScheduleParams,
} from "../types/types/room.type";
import {
	TCreateSubjectRoomAssignmentParams,
	TGetRoomAssignmentBySubjectAndScheduleParams,
	TGetSubjectAssignedRoomParams,
	TSubjectRoomAssignment,
} from "../types/types/subjectRoomAssignment";

class SubjectRoomAssignmentModel extends PrismaClientHelper {
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
	async CreateSubjectRoomAssignment(
		params: TCreateSubjectRoomAssignmentParams
	): Promise<TSubjectRoomAssignment> {
		return await this.prismaQueryHandler<TSubjectRoomAssignment>(async () => {
			try {
				return await this.prisma.subjectRoomAssignment.create({
					data: params,
					include: {
						subject: true,
						room: true,
					},
				});
			} catch (error: any) {
				console.log(error.message);
				throw new Error("Failed to create a room");
			}
		}, "CreateSubjectRoomAssignment");
	}

	/**
	 * This function is used to get the subjects assigned to the rooms
	 * Updated by: Mel Ubalde @ Friday, March 29 26, 2024 3:49 PM
	 * @param params
	 * @returns TUser| null
	 */
	async GetSubjectAssignedRoom(
		params: Partial<TGetSubjectAssignedRoomParams>
	): Promise<TSubjectRoomAssignment | null> {
		return await this.prismaQueryHandler<TSubjectRoomAssignment | null>(
			async () => {
				try {
					return await this.prisma.subjectRoomAssignment.findFirst({
						where: params,
						include: {
							subject: true,
							room: true,
						},
					});
				} catch {
					throw new Error("Failed to get a exam");
				}
			},
			"GetSubjectAssignedRoom"
		);
	}

	/**
	 * This function is used to get exam by date and time
	 * Updated by: Mel Ubalde @ Friday, March 29 26, 2024 3:49 PM
	 * @param params
	 * @returns TUser| null
	 */
	async GetRoomAssignmentBySubjectAndSchedule(
		params: TGetRoomAssignmentBySubjectAndScheduleParams
	): Promise<TSubjectRoomAssignment | null> {
		return await this.prismaQueryHandler<TSubjectRoomAssignment | null>(
			async () => {
				try {
					return await this.prisma.subjectRoomAssignment.findFirst({
						where: {
							roomId: params.roomId,
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
									],
								},
								{
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
													],
												},
												{
													endTime: {
														gt: params.startTime,
													},
												},
											],
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
															endTime: params.endTime,
														},
													],
												},
											],
										},
									],
								},
							],
						},
						include: {
							subject: true,
							room: true,
						},
					});
				} catch {
					throw new Error("Failed to get a subject");
				}
			},
			"GetRoomAssignmentBySubjectAndSchedule"
		);
	}

	/**
	 * This function is used to update subject schedule
	 * Updated by: Mel Ubalde @ Friday, March 29 26, 2024 3:49 PM
	 * @param params
	 * @returns TUser| null
	 */
	async UpdateSubjectRoomSchedule(
		params: TUpdateSubjectRoomScheduleParams
	): Promise<TSubjectRoomAssignment> {
		const { id, subjectId, roomId, ...otherParams } = params;
		return await this.prismaQueryHandler<TSubjectRoomAssignment>(async () => {
			try {
				return await this.prisma.subjectRoomAssignment.update({
					where: {
						id: id,
						subjectId: subjectId,
						roomId: roomId,
					},
					data: {
						...otherParams,
					},
					include: {
						subject: true,
						room: true,
					},
				});
			} catch {
				throw new Error("Failed to update of subject schedule");
			}
		}, "UpdateSubjectRoomSchedule");
	}
}

export default SubjectRoomAssignmentModel;
