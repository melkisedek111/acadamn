import { PrismaClient } from "@prisma/client";
import { prismaClient } from "../server";
import PrismaClientHelper from "../db/prisma-client.helper";
import { TCreateUserParams, TGetUsers, TGetUsersParams, TUser } from "../types/types/user.type";



class UserModel extends PrismaClientHelper {
	private prisma: PrismaClient;

	constructor() {
		super();
		this.prisma = prismaClient;
	}

	/**
	 * This function is used to create new user
	 * Updated by: Mel Ubalde @ Friday, March 29 26, 2024 3:49 PM
	 * @param params
	 * @returns TUser| null
	 */
	async CreateUser(params: TCreateUserParams): Promise<TUser> {
		return await this.prismaQueryHandler<TUser>(async () => {
			try {
				return await this.prisma.user.create({
					data: params,
					include: {
						studentIdentification: true
					},
				});
			} catch (error: any) {
                console.log(error.message)
				throw new Error("Failed to create a user");
			}
		}, "CreateUser");
	}


	/**
	 * This function is used to get the user
	 * Updated by: Mel Ubalde @ Friday, March 29 26, 2024 3:49 PM
	 * @param params
	 * @returns TUser| null
	 */
	async GetUserByParams(params: Partial<TUser>): Promise<TUser | null> {
		return await this.prismaQueryHandler<TUser | null>(async () => {
			try {
				return await this.prisma.user.findFirst({
					where: params,
					include: {
						studentIdentification: true
					}
				});
			} catch {
				throw new Error("Failed to get a user");
			}
		}, "GetUserByParams");
	}

	

	/**
	 * This function is used to get the users by params
	 * Updated by: Mel Ubalde @ Friday, March 29 26, 2024 3:49 PM
	 * @param params
	 * @returns TUser| null
	 */
	async GetUsersByParams(params: Partial<TGetUsersParams>): Promise<TGetUsers[]> {
		const skip = params?.skip || 0;
		const take = params?.take || 10;
		let whereClause = {};
		const whereParams = [];

		if (params?.blockId) whereParams.push({ studentIdentification: { blockId: params.blockId }});
		if (params?.yearLevel) whereParams.push({ studentIdentification: { yearLevel: params.yearLevel }});
		if (params?.fullNameOrStudentId) {
			const checkStudentId = /^\d{4}-\d{5}$/;
			if (checkStudentId.test(params?.fullNameOrStudentId)) {
				whereParams.push({ studentIdentification: { studentId: params.fullNameOrStudentId } });
			} else {
				const fullName = params.fullNameOrStudentId.trim().split(" ");
				for(const word of fullName) {
					whereParams.push({ firstName: { contains: word } });
					whereParams.push({ lastName: { contains: word } });
				}
				
			}
		}
		if (whereParams.length) whereClause = { OR: whereParams };
		if (whereParams.length && params?.fullNameOrStudentId) whereClause = { AND: whereParams };

		return await this.prismaQueryHandler<any>(async () => {
			try {
				return await this.prisma.user.findMany({
					skip,
					take,
					where: {
						...whereClause,
					},
					select: {
						id: true,
						firstName: true,
						middleName: true,
						lastName: true,
						role: true,
						gender: true,
						province: true,
						municipality: true,
						barangay: true,
						email: true,
						password: false,
						studentIdentification: {
							select: {
								yearLevel: true,
								id: true,
								studentId: true,
								block: {
									select: {
										id: true,
										name: true
									}
								}
							}
						},
					},
				});
			} catch {
				throw new Error("Failed to get a users");
			}
		}, "GetUsersByParams");
	}


    
}


export default UserModel;