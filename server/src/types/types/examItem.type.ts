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
    answers: string[];
    images: string[];
}

export type TCreateExamItemParams = Omit<TExamItem, "id">;
export type TGetExamItemByParams = Partial<Omit<TExamItem, "options" | "answers" | "images">>;