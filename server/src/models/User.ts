import { PrismaClient } from "@prisma/client";
import { prismaClient } from "../server";
import PrismaClientHelper from "../db/prisma-client.helper";
import { TCreateUserParams, TUser } from "../types/types/user.type";



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



    
}


export default UserModel;