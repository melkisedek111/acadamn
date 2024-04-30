import ExamItemModel from "../models/ExamItem";
import { CommandHandler } from "../types/interfaces/CommandHandler";
import { TCreateExamItemParams, TExamItem } from "../types/types/examItem.type";

export class CreateExamItem implements CommandHandler<TCreateExamItemParams, TExamItem> {
	async execute(params: TCreateExamItemParams): Promise<TExamItem> {
        const examItemModel = new ExamItemModel();
        
        const getExamItemByQuestion = await examItemModel.GetExamItemByParams({question: params.question});
        if(getExamItemByQuestion) throw new Error("Item question already exists.");

        let hasCode = false;
        let images: string[] = [];

        if(params.code && params.code) hasCode = true;
        if(params.images.length) images = params.images;

        const createdExamItem = await examItemModel.CreateExamItem({...params, hasCode, images});
        if(!createdExamItem) throw new Error("Creating exam item failed.");

        return createdExamItem;      
    }
}
