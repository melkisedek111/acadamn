import StudentIdentificationModel from "../models/StudentIdentification";
import { Task } from "../models/Task";
import UserModel from "../models/User";
import { QueryHandler } from "../types/interfaces/QueryHandler";
import { TLoggedInUser, TLoginUserParams, TUser } from "../types/types/user.type";
import bcrypt from "bcrypt";

export class LoginUserQuery implements QueryHandler<TLoginUserParams, TLoggedInUser> {
    async execute(params: TLoginUserParams): Promise<TLoggedInUser> {
        const userModel = new UserModel();
        const studentIdentificationModel = new StudentIdentificationModel();

        const getStudentIdentification = await studentIdentificationModel.GetStudentIdentification({ studentId: params.studentId });

        if(!getStudentIdentification) throw new Error("Student ID or password does not matched");
        
        if(!getStudentIdentification.isRegistered) throw new Error("Student ID is not yet registered.");

        const user = await userModel.GetUserByParams({ studentIdentificationId: getStudentIdentification.id });
        if(!user) throw new Error("Student ID or password does not matched");

        if(!params.password || !user.password) throw new Error("Student ID or password does not matched");

        const comparedPassword = await bcrypt.compare(params.password, user.password);
        if(!comparedPassword) throw new Error("Student ID or password does not matched");
        
        const { studentIdentificationId, studentIdentification, firstName, lastName, role, email, id } = user

        return { studentIdentificationId, studentIdentification, firstName, lastName, role, email, id };
    }
}