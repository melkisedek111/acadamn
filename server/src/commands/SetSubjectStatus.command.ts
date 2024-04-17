import { CommandHandler } from "../types/interfaces/CommandHandler";
import { TSetSubjectStatusParams, TSubject } from "../types/types/subject.types";
import SubjectModel from "../models/Subject";

export class SetSubjectStatusCommand implements CommandHandler<TSetSubjectStatusParams, TSubject> {
	async execute(params: TSetSubjectStatusParams): Promise<TSubject> {
                const subjectModel = new SubjectModel();
                
                const subject = await subjectModel.GetSubjectByParams({ id: params.id });

                if (!subject) throw new Error("Subject does not exists.");

                const updateSubject = await subjectModel.UpdateSubject({id: params.id, isActive: !subject.isActive});

                return updateSubject;
        }
}
