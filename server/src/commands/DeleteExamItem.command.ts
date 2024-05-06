import ExamItemModel from "../models/ExamItem";
import { CommandHandler } from "../types/interfaces/CommandHandler";
import { TDeleteExamItemParams } from "../types/types/examItem.type";

export class DeleteExamItem implements CommandHandler<TDeleteExamItemParams, string[]> {
	async execute(params: TDeleteExamItemParams): Promise<string[]> {
        const examItemModel = new ExamItemModel();

        const getExamItemById = await examItemModel.GetExamItemByParams({id: params.id});
        if(!getExamItemById) throw new Error("Item does not exists.");

        const deleteExamItem = await examItemModel.UpdateExamItem({id: params.id, isDeleted: true});
        if(!deleteExamItem) throw new Error("Failed to delete exam item.");

        const listFileNames = deleteExamItem.images;
        return listFileNames;      
    }
}

export class HardDeleteExamItem implements CommandHandler<TDeleteExamItemParams, string[]> {
	async execute(params: TDeleteExamItemParams): Promise<string[]> {
        const examItemModel = new ExamItemModel();

        const getExamItemById = await examItemModel.GetExamItemByParams({id: params.id});
        if(!getExamItemById) throw new Error("Item does not exists.");

        const deleteExamItem = await examItemModel.DeleteExamItem({ id: params.id });
        if(!deleteExamItem) throw new Error("Failed to delete exam item.");

        const listFileNames = deleteExamItem.images;

        return listFileNames;      
    }
}
