import { OPTION_TYPE, QUESTION_TYPE } from "@/constants/app.constants";
import { ERROR_MESSAGE, TItem, TOptionOrAnswer } from "./useItemCard";

export enum ActionTypes {
    UPDATE_STATE = "UPDATE_STATE",
    ADD_OPTION = "ADD_OPTION",
    REMOVE_OPTION_OR_ANSWER = "REMOVE_OPTION_OR_ANSWER",
    OPTION_OR_ANSWER_VALUE = "OPTION_OR_ANSWER_VALUE",
    ADD_ANOTHER_ANSWER = "ADD_ANOTHER_ANSWER",
    SELECT_ON_CHANGE_VALUE = "SELECT_ON_CHANGE_VALUE",
    SAVE_ITEM = "SAVE_ITEM",
    TEXTAREA_CHANGE_VALUE = "TEXTAREA_CHANGE_VALUE",
    ADD_ANSWER_BY_CHECKBOX = "ADD_ANSWER_BY_CHECKBOX",
    ADD_ANSWER_BY_RADIO = "ADD_ANSWER_BY_RADIO",
    GET_IMAGE = "GET_IMAGE"
}

export type TItemAction =
    { type: ActionTypes.UPDATE_STATE, payload?: { updatedState: TItem } } |
    { type: ActionTypes.ADD_OPTION, payload?: any } |
    { type: ActionTypes.REMOVE_OPTION_OR_ANSWER, payload: { value: string, index: number, key: string } } |
    { type: ActionTypes.OPTION_OR_ANSWER_VALUE, payload: { value: string | boolean, index: number, key: string } } |
    { type: ActionTypes.ADD_ANSWER_BY_CHECKBOX, payload: { value: string, checked: boolean } } |
    { type: ActionTypes.ADD_ANSWER_BY_RADIO, payload: { value: string } } |
    { type: ActionTypes.TEXTAREA_CHANGE_VALUE, payload: { value: string } } |
    { type: ActionTypes.ADD_ANOTHER_ANSWER, payload?: any } |
    { type: ActionTypes.SAVE_ITEM, payload?: any } |
    { type: ActionTypes.SELECT_ON_CHANGE_VALUE, payload: { key: string, value: string } } |
    { type: ActionTypes.GET_IMAGE, payload: { value: FileList, imageSrc: string[] } }

/**
 * This function is a reducer function that handle value for creating a Item
 * Updated by: Mel Ubalde @ Friday, March 28, 2024 3:49 PM
 * @param state TItem
 * @param action TItemAction
 * @returns state TItem
 */
export const ItemReducer = (state: TItem, action: TItemAction) => {
    const { type, payload } = action;

    const reducerObject = {
        /**
         * function that selecting the value for the "SELECT INPUTS" 
         * as well as defining the corresponding inputs with their initial value or resetting the values
         */
        [ActionTypes.SELECT_ON_CHANGE_VALUE]: () => {
            const { key, value } = payload as { key: string, value: string };
            const currentState = { ...state };

            // reset the value of CODE and CODE_LANGUAGE when the selected question type is GENERAL QUESTION
            if (key === "questionType" && value === QUESTION_TYPE.GENERAL_QUESTION.value) {
                currentState.code = "";
                currentState.codeLanguage = "";
            }

            // initialize the value for both OPTIONS and ANSWERS when OPTION TYPE is SINGLE_CHOICE
            if (key === "optionType" && value === OPTION_TYPE.SINGLE_CHOICE.value) {
                currentState.options = [{ value: "", errorCode: "" }]
                currentState.answers = [{ value: "", errorCode: "" }]
            }

            // initialize the value for OPTIONS and reset the ANSWERS when OPTION TYPE is MULTIPLE_CHOICE
            if (key === "optionType" && value === OPTION_TYPE.MULTIPLE_CHOICE.value) {
                currentState.options = [{ value: "", errorCode: "" }]
                currentState.answers = [];
            }

            // initialize the value for OPTIONS and reset the ANSWERS when OPTION TYPE is MULTIPLE_CHOICE
            if (key === "optionType" && value === OPTION_TYPE.FILL_IN_THE_BLANKS_OR_ENUMERATION.value) {
                currentState.options = []
                currentState.answers = [{ value: "", errorCode: "" }];
            }

            // initialize the value for ANSWERS when OPTION TYPE is EXPLANATION
            if (key === "optionType" && (value === OPTION_TYPE.EXPLANATION.value)) {
                currentState.answers = [{ value: "", errorCode: "" }]
            }

            return { ...currentState, [key as keyof TItem]: value };
        },
        // function that will add option for selected option types 
        [ActionTypes.ADD_OPTION]: () => {
            const currentState = { ...state };

            // add options are available only for option type SINGLE_CHOICE and MULTIPLE_CHOICE
            if ([OPTION_TYPE.SINGLE_CHOICE.value, OPTION_TYPE.MULTIPLE_CHOICE.value].includes(currentState.optionType)) {
                currentState.options = [...currentState.options, { value: "", errorCode: "" }]
            }

            return { ...currentState };
        },
        // function that will remove options or remove answers
        [ActionTypes.REMOVE_OPTION_OR_ANSWER]: () => {
            const currentState = { ...state };
            const { index, key, value } = payload;

            // variable that holds the options and answer values that will filter out
            const filteredOptionOrAnswer: any = {
                [key]: currentState[key as keyof TItem].filter((option: TOptionOrAnswer, i: number) => i !== index)
            };

            // if option type is MULTIPLE_CHOICE then remove the answers are not checked by checkbox
            if (currentState.optionType === OPTION_TYPE.MULTIPLE_CHOICE.value || currentState.optionType === OPTION_TYPE.SINGLE_CHOICE.value) {
                const selectedKey = "answers";
                filteredOptionOrAnswer[selectedKey] = currentState[selectedKey as keyof TItem].filter((option: TOptionOrAnswer, i: number) => option.value !== value);
            }

            return { ...currentState, ...filteredOptionOrAnswer };
        },
        // set the value on change for input options and answers
        [ActionTypes.OPTION_OR_ANSWER_VALUE]: () => {
            const currentState = { ...state };
            const { index, value, key } = payload;
            currentState[key as keyof TItem][index].value = value;
            currentState[key as keyof TItem][index].errorCode = "";

            for (const i in currentState[key as keyof TItem]) {
                const option = currentState[key as keyof TItem][i];

                // this will check if the options or answers has a duplicate value
                if (option.value !== "" && option.value === value && Number(i) !== index) {
                    currentState[key as keyof TItem][index].errorCode = ERROR_MESSAGE.VALUE_EXISTS.code;
                    break;
                }
            }

            return { ...currentState };
        },
        // this will add another a empty value answer and will create a input element
        [ActionTypes.ADD_ANOTHER_ANSWER]: () => {
            const currentState = { ...state };

            // initialize an empty value answer when selecting the option type FILL_IN_THE_BLANKS_OR_ENUMERATION for the first time
            if (currentState.optionType === OPTION_TYPE.FILL_IN_THE_BLANKS_OR_ENUMERATION.value) {
                currentState.answers = [...currentState.answers, { value: "", errorCode: "" }];
            }

            return { ...currentState };
        },
        // function that set the value of a textarea onchange
        [ActionTypes.TEXTAREA_CHANGE_VALUE]: () => {
            const currentState = { ...state };
            const { value } = payload;
            currentState.question = value;

            return { ...currentState };
        },
        // function that will set the answer value when checkbox is checked when option type is MULTIPLE_CHOICE
        [ActionTypes.ADD_ANSWER_BY_CHECKBOX]: () => {
            const currentState = { ...state };
            const { value, checked } = payload;
            let answers: TOptionOrAnswer[] = [];

            // toggle that add and remove answer value
            if (checked) {
                answers = [...currentState.answers, { value, errorCode: "" }];
            } else {
                answers = currentState.answers.filter(answer => answer.value !== value);
            }

            return { ...currentState, answers };
        },
        [ActionTypes.ADD_ANSWER_BY_RADIO]: () => {
            const currentState = { ...state };
            const { value } = payload;
            let answers: TOptionOrAnswer[] = [{ value, errorCode: "" }];
            return { ...currentState, answers };
        },
        [ActionTypes.SAVE_ITEM]: () => {
            const currentState = { ...state };
            currentState.errors.questionType = false;
            currentState.errors.question = false;
            currentState.errors.code = false;
            currentState.errors.codeLanguage = false;
            currentState.errors.optionType = false;

            if (!currentState.questionType) currentState.errors.questionType = true;
            if (!currentState.question) currentState.errors.question = true;

            if (currentState.questionType === QUESTION_TYPE.CODE_QUESTION.value) {
                if (!currentState.code) currentState.errors.code = true;
                if (!currentState.codeLanguage) currentState.errors.codeLanguage = true;
            }
            if (!currentState.optionType) currentState.errors.optionType = true;

            if ([OPTION_TYPE.SINGLE_CHOICE.value, OPTION_TYPE.MULTIPLE_CHOICE.value].includes(currentState.optionType)) {
                const options = [...currentState.options];
                const optionValue: string[] = [];

                for (let option of options) {
                    option.errorCode = "";

                    if (option.value === "") {
                        option.errorCode = ERROR_MESSAGE.EMPTY.code;
                    } else if (optionValue.includes(option.value)) {
                        option.errorCode = ERROR_MESSAGE.VALUE_EXISTS.code;
                    }

                    optionValue.push(option.value);
                }

                currentState.options = [...options];
            }

            if (currentState.answers.length) {
                const answers = [...currentState.answers];
                const answerValue: string[] = [];

                for (let answer of answers) {
                    answer.errorCode = "";

                    if (answer.value === "") {
                        answer.errorCode = ERROR_MESSAGE.EMPTY.code;
                    } else if (answerValue.includes(answer.value)) {
                        answer.errorCode = ERROR_MESSAGE.VALUE_EXISTS.code;
                    }

                    answerValue.push(answer.value);
                }

                currentState.answers = [...answers];
            }

            if (currentState.image?.length) {

                for (const image of currentState.image) {
                    const selectedImage = image as File;
                    
                    if (image instanceof File) {
                        if (!["image/jpeg", "image/jpg", "image/png"].includes(selectedImage.type) || selectedImage.size > 3000000) {
                            currentState.errors.image = true;
                            break;
                        } else {
                            currentState.errors.image = false;
                        }
                    }
                }
            }

            return { ...currentState };
        },
        [ActionTypes.GET_IMAGE]: () => {
            const currentState = { ...state };
            const { value, imageSrc } = payload;
            console.log({value, imageSrc})
            currentState.image = value;
            currentState.readImageSource = imageSrc;
            return { ...currentState };
        },
        [ActionTypes.UPDATE_STATE]: () => {
            const { updatedState } = payload;
            return updatedState;
        }
    }

    return reducerObject[type]() ?? state;
}