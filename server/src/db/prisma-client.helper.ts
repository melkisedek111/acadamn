import { prismaClient } from "../server";

class PrismaClientHelper {
    protected async prismaQueryHandler<T>(callback: () => Promise<T>, keyword?: string): Promise<T | any> {
        try {
            return await callback();
        } catch (error: any) {
            if (error) {
                console.log("--------------------------------")
                console.log(keyword || "SOME FUNCTION", error?.message)
                console.log("--------------------------------")
            }
        }
    }

    async usePrismaTransaction(transactionArray: any[]) {
        return await prismaClient.$transaction(transactionArray);
    }
}

export default PrismaClientHelper;