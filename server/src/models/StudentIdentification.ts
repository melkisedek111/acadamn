import { PrismaClient } from "@prisma/client";
import { prismaClient } from "../server";
import PrismaClientHelper from "../db/prisma-client.helper";
import { TCreateStudentIdentificationParams, TStudentIdentification, TUpdateRegisteredStudentIdentificationParams } from "../types/types/studentIdentification.type";

class StudentIdentificationModel extends PrismaClientHelper {
	private prisma: PrismaClient;

	constructor() {
		super();
		this.prisma = prismaClient;
	}

	/**
	 * This function is used to create new student identification
	 * Updated by: Mel Ubalde @ Friday, March 29 26, 2024 3:49 PM
	 * @param params
	 * @returns TUser| null
	 */
	async CreateStudentIdentification(params: TCreateStudentIdentificationParams): Promise<TStudentIdentification> {
		return await this.prismaQueryHandler<TStudentIdentification>(async () => {
			try {
				return await this.prisma.studentIdentification.create({
					data: params,
				});
			} catch (error: any) {
				console.log(error.message);
				throw new Error("Failed to create a student identification");
			}
		}, "CreateStudentIdentification");
	}

	/**
	 * This function is used to get the user
	 * Updated by: Mel Ubalde @ Friday, March 29 26, 2024 3:49 PM
	 * @param params
	 * @returns TStudentIdentification | null
	 */
	async GetStudentIdentification(params: Partial<TStudentIdentification>): Promise<TStudentIdentification | null> {
		return await this.prismaQueryHandler<TStudentIdentification | null>(
			async () => {
				try {
					return await this.prisma.studentIdentification.findFirst({
						where: params,
					});
				} catch {
					throw new Error("Failed to get a student identification");
				}
			},
			"GetStudentIdentification"
		);
	}

		/**
	 * This function is used to update student identification register
	 * Updated by: Mel Ubalde @ Friday, March 29 26, 2024 3:49 PM
	 * @param params
	 * @returns TStudentIdentification | null
	 */
	async UpdateIsRegisteredStudentIdentification(params: Partial<TUpdateRegisteredStudentIdentificationParams>): Promise<TStudentIdentification> {
		return await this.prismaQueryHandler<TStudentIdentification>(
			async () => {
				try {
					return await this.prisma.studentIdentification.update({
						where: {
							id: params.id
						},
						data: {
							isRegistered: true
						}
					});
				} catch {
					throw new Error("Failed to update student identification");
				}
			},
			"UpdateIsRegisteredStudentIdentification"
		);
	}
}

export default StudentIdentificationModel;
