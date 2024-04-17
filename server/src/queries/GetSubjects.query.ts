import SubjectModel from "../models/Subject";
import { QueryHandler } from "../types/interfaces/QueryHandler";
import { TGetSubject } from "../types/types/subject.types";

export class GetSubjectQuery implements QueryHandler<unknown, TGetSubject[]> {
    async execute(): Promise<TGetSubject[]> {
        const subjectModel = new SubjectModel();
        const subjects = await subjectModel.GetSubjects();
        return subjects;
    }
}