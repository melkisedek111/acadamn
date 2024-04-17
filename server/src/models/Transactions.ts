import { PrismaClient } from "@prisma/client";
import { prismaClient } from "../server";
import PrismaClientHelper from "../db/prisma-client.helper";
import { TCreateUserParams, TUser } from "../types/types/user.type";
import { TStudentIdentification } from "../types/types/studentIdentification.type";



class TransactionsModel extends PrismaClientHelper {
	private prisma: PrismaClient;

	constructor() {
		super();
		this.prisma = prismaClient;
	}

	/**
	 * This function is used to create new user and update student identification through prisma transaction
	 * Updated by: Mel Ubalde @ Friday, March 29 26, 2024 3:49 PM
	 * @param params
	 * @returns TUser, TStudentIdentification
	 */
	async CreateNewAccountTransaction(params: TCreateUserParams): Promise<[TUser, TStudentIdentification]> {
		return await this.prismaQueryHandler<[TUser, TStudentIdentification]>(async () => {
			try {
				const [user, studentIdentification] = await this.prisma.$transaction([
                    this.prisma.user.create({
                        data: params,
                        include: {
                            studentIdentification: true
                        },
                        
                    }),
                    this.prisma.studentIdentification.update({
						where: {
							id: params.studentIdentificationId
						},
						data: {
							isRegistered: true
						}
					})
                ])
                return [user, studentIdentification];
			} catch (error: any) {
                console.log(error.message)
				throw new Error("Failed to create a user");
			}
		}, "CreateNewAccountTransaction");
	}   
}


export default TransactionsModel;