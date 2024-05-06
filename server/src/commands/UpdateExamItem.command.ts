import ExamItemModel from "../models/ExamItem";
import { CommandHandler } from "../types/interfaces/CommandHandler";
import { TUpdateExamItemParams, TExamItem } from "../types/types/examItem.type";

export class UpdateExamItemCommand implements CommandHandler<TUpdateExamItemParams, TExamItem> {
	async execute(params: TUpdateExamItemParams): Promise<TExamItem> {
        const examItemModel = new ExamItemModel();

        const getExamItem = await examItemModel.GetExamItemByParams({id: params.id});
        if(!getExamItem) throw new Error("Item question does not exists.");

        if(getExamItem.question !== params.question) {
            const getExamItemByQuestion = await examItemModel.GetExamItemByParams({ question: params.question });
            if(getExamItemByQuestion) throw new Error("Item question already exists");
        }

        const images: string[] = getExamItem.images;
        if(params?.images?.length) {
            images.push(...params.images)
        }

        const createdExamItem = await examItemModel.UpdateExamItem({...params, images});
        if(!createdExamItem) throw new Error("Updating exam item failed.");

        return createdExamItem;      
    }
}
