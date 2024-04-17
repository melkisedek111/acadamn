import { PrismaClient } from "@prisma/client";

declare global {
	var prismaClient: undefined | PrismaClient;
}
let prismaClient: PrismaClient;

if (process.env.NODE_ENV === "production") {
	prismaClient = new PrismaClient();
} else {
	if (!global.prismaClient) {
		global.prismaClient = new PrismaClient();
	}
	prismaClient = global.prismaClient;
}

export default prismaClient;