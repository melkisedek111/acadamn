export type TExamItem = {
    id: number;
    itemCodeId: string | null;
    examId: number;
    itemType: string;
    question: string;
    hasCode: boolean;
    code: string | null;
    codeLanguage: string | null;
    optionType: string;
    options: string[];
    isDeleted: boolean;
    isActive: boolean;
    answers: string[];
    images: string[];
}

export type TCreateExamItemParams = Omit<TExamItem, "id">;
export type TGetExamItemByParams = Partial<Omit<TExamItem, "options" | "answers" | "images">>;
export type TUpdateExamItemParams = Partial<TExamItem>;
export type TDeleteExamItemParams = Pick<TExamItem, "id">;
export type TDeleteSpecificExamItemImageParams = {
    id: number;
    imageName: string;
};