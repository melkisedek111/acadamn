import { Request } from "express";
import jwt from "jsonwebtoken";
import { TUserProfileToken } from "../types/types/token.types";

export const getUserProfile = (request: Request): TUserProfileToken => {
    const authHeader = request.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
        throw new Error("No user found!");
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as TUserProfileToken;

    return decoded
}