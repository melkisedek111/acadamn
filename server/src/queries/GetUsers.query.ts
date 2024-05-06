import UserModel from "../models/User";
import { QueryHandler } from "../types/interfaces/QueryHandler";
import { TGetUsers, TGetUsersParams } from "../types/types/user.type";

export class GetUsersQuery implements QueryHandler<Partial<TGetUsersParams>, TGetUsers[]> {
    async execute(params: Partial<TGetUsersParams>): Promise<TGetUsers[]> {
        const userModel = new UserModel();
        const users = await userModel.GetUsersByParams(params);
        return users;
    }
}