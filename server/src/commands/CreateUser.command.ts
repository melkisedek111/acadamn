import { Task } from "../models/Task";
import UserModel from "../models/User";
import { CommandHandler } from "../types/interfaces/CommandHandler";
import {
	TCreatedUser,
	TCreateUserParams,
} from "../types/types/user.type";
import bcrypt from "bcrypt";
import { ROLES } from "../utils/constants";
import StudentIdentificationModel from "../models/StudentIdentification";
import PrismaClientHelper from "../db/prisma-client.helper";
import TransactionsModel from "../models/Transactions";

export class CreateUserCommand
	implements CommandHandler<TCreateUserParams, TCreatedUser>
{
	async execute(params: TCreateUserParams): Promise<TCreatedUser> {
		const userModel = new UserModel();
        const studentIdentificationModel = new StudentIdentificationModel();

        const getStudentIdentification = await studentIdentificationModel.GetStudentIdentification({ id: params.studentIdentificationId });
        if (!getStudentIdentification) throw new Error("Student ID does not exists");

		const getUserByStudentId = await userModel.GetUserByParams({ studentIdentificationId: params.studentIdentificationId });
		if (getUserByStudentId) throw new Error("Student ID already exists");

		const getUserByEmail = await userModel.GetUserByParams({
			email: params.email,
		});
		if (getUserByEmail) throw new Error("Student email already exists");

        if (!params.password) throw new Error("Password is required");

		const saltRounds = 10;
		const hashedPassword = await bcrypt.hash(params.password, saltRounds);

		if (!hashedPassword) throw new Error("Failed to create user");

		const transactionsModel = new TransactionsModel();

		const [createdUser, updateRegisterStudentIdentification] = await transactionsModel.CreateNewAccountTransaction({ ...params, password: hashedPassword, role: ROLES.STUDENT });

		if (!createdUser || !updateRegisterStudentIdentification) throw new Error("Failed to create user");

		const { firstName, lastName, role, studentIdentificationId, studentIdentification, email } = createdUser;

		return { firstName, lastName, role, studentIdentificationId, studentIdentification, email };
	}
}
