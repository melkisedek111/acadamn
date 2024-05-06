import ExamItemModel from "../models/ExamItem";
import { CommandHandler } from "../types/interfaces/CommandHandler";
import { TDeleteSpecificExamItemImageParams } from "../types/types/examItem.type";

export class DeleteSpecificExamItemImageCommand implements CommandHandler<TDeleteSpecificExamItemImageParams, string> {
	async execute(params: TDeleteSpecificExamItemImageParams): Promise<string> {
        const examItemModel = new ExamItemModel();

        const getExamItem = await examItemModel.GetExamItemByParams({id: params.id});
        if(!getExamItem) throw new Error("Item question does not exists.");
        
        const updatedImage  = getExamItem.images.filter(image => image !== params.imageName);

        const createdExamItem = await examItemModel.UpdateExamItem({id: params.id, images: updatedImage});
        if(!createdExamItem) throw new Error("Updating exam item failed.");

        return params.imageName;      
    }
}
