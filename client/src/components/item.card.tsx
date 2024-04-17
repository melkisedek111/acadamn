"use client";

import React, { useEffect, useReducer, useRef, useState } from 'react'

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from '@/components/ui/textarea'

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"


import Editor from "@monaco-editor/react";
import { PlusIcon, TrashIcon } from '@radix-ui/react-icons';
import { Checkbox } from '@/components/ui/checkbox';

type TErrorCode = "" | "EMPTY" | "VALUE_EXISTS";

type TOptionOrAnswer = {
    value: string;
    errorCode: TErrorCode;
}

type TItemError = {
    questionType: boolean;
    question: boolean;
    code: boolean;
    codeLanguage: boolean;
    optionType: boolean;
}
export type TItem = {
    count?: number;
    itemCodeId?: string;
    questionType: string;
    question: string;
    hasCode: boolean;
    code: string;
    codeLanguage: string;
    optionType: string;
    options: TOptionOrAnswer[];
    answers: TOptionOrAnswer[];
    image?: any;
    errors: TItemError
}

enum ActionTypes {
    ADD_OPTION = "ADD_OPTION",
    REMOVE_OPTION_OR_ANSWER = "REMOVE_OPTION_OR_ANSWER",
    OPTION_OR_ANSWER_VALUE = "OPTION_OR_ANSWER_VALUE",
    ADD_ANOTHER_ANSWER = "ADD_ANOTHER_ANSWER",
    SELECT_ON_CHANGE_VALUE = "SELECT_ON_CHANGE_VALUE",
    SAVE_ITEM = "SAVE_ITEM",
    TEXTAREA_CHANGE_VALUE = "TEXTAREA_CHANGE_VALUE",
    ADD_ANSWER_BY_CHECKBOX = "ADD_ANSWER_BY_CHECKBOX"
}

type TItemAction =
    { type: ActionTypes.ADD_OPTION, payload?: any } |
    { type: ActionTypes.REMOVE_OPTION_OR_ANSWER, payload: { value: string, index: number, key: string } } |
    { type: ActionTypes.OPTION_OR_ANSWER_VALUE, payload: { value: string | boolean, index: number, key: string } } |
    { type: ActionTypes.ADD_ANSWER_BY_CHECKBOX, payload: { value: string, checked: boolean } } |
    { type: ActionTypes.TEXTAREA_CHANGE_VALUE, payload: { value: string } } |
    { type: ActionTypes.ADD_ANOTHER_ANSWER, payload?: any } |
    { type: ActionTypes.SAVE_ITEM, payload?: any } |
    { type: ActionTypes.SELECT_ON_CHANGE_VALUE, payload: { key: string, value: string } }

const ITEM_ERROR_MESSAGE = {
    questionType: "Question type is required.",
    question: "Question question is required.",
    code: "Code is required",
    codeLanguage: "Language is required.",
    optionType: "Question option type is required.",
}

const ERROR_MESSAGE: {
    EMPTY: {
        code: TErrorCode;
        message: string;
    },
    VALUE_EXISTS: {
        code: TErrorCode;
        message: string;
    }
} = {
    EMPTY: {
        code: "EMPTY",
        message: "This field value is empty."
    },
    VALUE_EXISTS: {
        code: "VALUE_EXISTS",
        message: "The field value is already exists."
    }
}

const QUESTION_TYPE = {
    GENERAL_QUESTION: {
        label: "General Question",
        value: "GENERAL_QUESTION"
    },
    CODE_QUESTION: {
        label: "Code Question",
        value: "CODE_QUESTION"
    }
}

const OPTION_TYPE = {
    SINGLE_CHOICE: {
        label: "Single Choice",
        value: "SINGLE_CHOICE"
    },
    MULTIPLE_CHOICE: {
        label: "Multiple Choice",
        value: "MULTIPLE_CHOICE"
    },
    TRUE_OR_FALSE: {
        label: "True or False",
        value: "TRUE_OR_FALSE"
    },
    FILL_IN_THE_BLANKS_OR_ENUMERATION: {
        label: "Fill in the Blanks or Enumeration",
        value: "FILL_IN_THE_BLANKS_OR_ENUMERATION"
    },
    EXPLANATION: {
        label: "Explanation",
        value: "EXPLANATION"
    },
}

const CODE_LANGUAGES = [
    { value: "javascript", label: "JavaScript" },
    { value: "python", label: "Python" },
    { value: "java", label: "Java" },
    { value: "csharp", label: "C#" },
    { value: "cplusplus", label: "C++" },
    { value: "typescript", label: "TypeScript" },
    { value: "php", label: "PHP" },
    { value: "ruby", label: "Ruby" },
    { value: "swift", label: "Swift" },
    { value: "go", label: "Go" },
    { value: "rust", label: "Rust" },
    { value: "kotlin", label: "Kotlin" },
    { value: "scala", label: "Scala" },
    { value: "dart", label: "Dart" },
    { value: "r", label: "R" },
    { value: "perl", label: "Perl" },
    { value: "html", label: "HTML" },
    { value: "css", label: "CSS" },
    { value: "sql", label: "SQL" },
]

/**
 * This function is a reducer function that handle value for creating a Item
 * Updated by: Mel Ubalde @ Friday, March 28, 2024 3:49 PM
 * @param state TItem
 * @param action TItemAction
 * @returns state TItem
 */
const ItemReducer = (state: TItem, action: TItemAction) => {

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
            if (currentState.optionType === OPTION_TYPE.MULTIPLE_CHOICE.value) {
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

            return { ...currentState };
        }
    }

    return reducerObject[type]() ?? state;
}

const ItemCard = (props: { item: TItem, itemNumber: number }) => {
    const [item, dispatch] = useReducer(ItemReducer, props.item);
    const optionRef = useRef<HTMLInputElement[]>([]);
    type HTMLInputAndTextAreaElement = HTMLInputElement & HTMLTextAreaElement;
    const answerRef = useRef<HTMLInputAndTextAreaElement[]>([]);


    const handleValueChange = (value: string, key: string) => {
        optionRef.current = [];
        answerRef.current = [];
        dispatch({ type: ActionTypes.SELECT_ON_CHANGE_VALUE, payload: { key, value } });
    }

    const handleAddOption = () => dispatch({ type: ActionTypes.ADD_OPTION });
    const handleAddAnotherAnswer = () => dispatch({ type: ActionTypes.ADD_ANOTHER_ANSWER });
    const handleTextAreaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => dispatch({ type: ActionTypes.TEXTAREA_CHANGE_VALUE, payload: { value: event.target.value } });
    const handleCheckBoxChange = (checked: boolean, value: string) => dispatch({ type: ActionTypes.ADD_ANSWER_BY_CHECKBOX, payload: { checked, value } });

    const handleRemoveOptionOrAnswer = (value: string, index: number, key: string) => {
        if (optionRef.current.length) {
            optionRef.current = optionRef.current.filter((_, i) => i !== index);
            optionRef.current[optionRef.current?.length - 1]?.focus();
        }

        if (answerRef.current.length) {
            answerRef.current = answerRef.current.filter((_, i) => i !== index);
            answerRef.current[answerRef.current?.length - 1]?.focus();
        }

        dispatch({ type: ActionTypes.REMOVE_OPTION_OR_ANSWER, payload: { index, value, key } });
    };

    const handleOptionChangeValue = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number, key: string) => {
        const value = event.target.value;
        dispatch({ type: ActionTypes.OPTION_OR_ANSWER_VALUE, payload: { value, index, key } });
    }

    const handleSaveItem = () => {
        dispatch({ type: ActionTypes.SAVE_ITEM });
    }

    useEffect(() => {
        // statement for focusing the input for both answer and options when remove or add
        if (item.options.length && optionRef.current) {
            optionRef.current[optionRef.current?.length - 1]?.focus();
        }
        if (item.answers.length && answerRef.current) {
            answerRef.current[answerRef.current?.length - 1]?.focus();
        }
    }, [item.options, item.answers])

    return (
        <Card className="">
            <CardHeader>
                <CardTitle className="text-lg">Question {props.item.count}</CardTitle>
            </CardHeader>
            <CardContent className='flex flex-col gap-6'>
                <div className="flex flex-col gap-2">
                    <Label htmlFor="questionType">Question Types</Label>
                    <Select value={item.questionType} onValueChange={(value) => handleValueChange(value, "questionType")}>
                        <SelectTrigger className="">
                            <SelectValue placeholder="Select a Question Type" />
                        </SelectTrigger>
                        <SelectContent id="questionType">
                            <SelectGroup>
                                <SelectLabel>Types</SelectLabel>
                                <SelectItem value={QUESTION_TYPE.GENERAL_QUESTION.value}>{QUESTION_TYPE.GENERAL_QUESTION.label}</SelectItem>
                                <SelectItem value={QUESTION_TYPE.CODE_QUESTION.value}>{QUESTION_TYPE.CODE_QUESTION.label}</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    {
                        item.errors.questionType && (<small className="text-red-500">{ITEM_ERROR_MESSAGE.questionType}</small>)
                    }
                </div>
                <div className="flex flex-col gap-2">
                    <Label htmlFor="question">Question</Label>
                    <div className="overlay rounded-md overflow-hidden w-full h-full shadow-4xl">
                        <Textarea value={item.question} placeholder="Type your question here." id="question" rows={5} onChange={handleTextAreaChange} />
                    </div>
                    {
                        item.errors.question && <small className="text-red-500">{ITEM_ERROR_MESSAGE.question}</small>
                    }
                </div>
                {
                    item.questionType ?
                        item.questionType === QUESTION_TYPE.CODE_QUESTION.value ? (
                            <>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="codeLanguage">Code Language</Label>
                                    <Select
                                        value={item.codeLanguage}
                                        onValueChange={(value) => handleValueChange(value, "codeLanguage")}>
                                        <SelectTrigger className="">
                                            <SelectValue placeholder="Select a code language" />
                                        </SelectTrigger>
                                        <SelectContent id="codeLanguage">
                                            <SelectGroup>
                                                <SelectLabel>Code Language</SelectLabel>
                                                {
                                                    CODE_LANGUAGES.map(item => (
                                                        <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
                                                    ))
                                                }
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    {
                                        item.errors.codeLanguage && (<small className="text-red-500">{ITEM_ERROR_MESSAGE.codeLanguage}</small>)
                                    }
                                </div>
                                {
                                    item.codeLanguage && (
                                        <div className="flex flex-col gap-2">
                                            <Label htmlFor="code">Code</Label>
                                            <div className="overlay rounded-md overflow-hidden w-full h-full shadow-4xl">
                                                <Editor
                                                    // options={{ readOnly: true }}
                                                    height={"300px"}
                                                    width={`100%`}
                                                    language={item.codeLanguage}
                                                    defaultLanguage="javascript"
                                                    value={item.code}
                                                    theme={"vs-dark"}
                                                    onChange={(value) => {
                                                        if (value) handleValueChange(value, "code")
                                                    }}
                                                />
                                            </div>
                                            {
                                                item.errors.code && (<small className="text-red-500">{ITEM_ERROR_MESSAGE.code}</small>)
                                            }
                                        </div>
                                    )
                                }
                            </>
                        ) : null
                        : null
                }

                <div className="flex flex-col gap-2">
                    <Label htmlFor="optionTypes">Option Types</Label>
                    <Select
                        value={item.optionType}
                        onValueChange={(value) => handleValueChange(value, "optionType")}>
                        <SelectTrigger className="">
                            <SelectValue placeholder="Select a Option Type" />
                        </SelectTrigger>
                        <SelectContent id="optionTypes">
                            <SelectGroup>
                                <SelectLabel>Types</SelectLabel>
                                {
                                    Object.values(OPTION_TYPE).map(item => (
                                        <SelectItem
                                            key={item.value}
                                            value={item.value}>
                                            {item.label}
                                        </SelectItem>
                                    ))
                                }
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    {
                        item.errors.optionType && (<small className="text-red-500">{ITEM_ERROR_MESSAGE.optionType}</small>)
                    }
                </div>
                {
                    OPTION_TYPE.SINGLE_CHOICE.value === item.optionType && (
                        <>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="selectedOptionType">Option Type: <span className='text-green-700'>{item.optionType}</span></Label>
                                <div className="flex flex-col gap-2 pl-2">
                                    {
                                        item.options.map((option: TOptionOrAnswer, index: number) => (
                                            <div key={`${item.optionType}-${index}`}>
                                                <div className="grid grid-cols-10 gap-2 items-center">
                                                    <Label
                                                        key={`option-${index}`}
                                                        htmlFor="selectedOptionType"
                                                        className="col-span-1 justify-self-end">
                                                        Option {index + 1}
                                                    </Label>
                                                    <Input
                                                        ref={el => {
                                                            if (optionRef?.current && el) {
                                                                optionRef.current.push(el);
                                                            }
                                                        }}
                                                        className="col-span-8"
                                                        placeholder={`Enter you option ${index + 1} here.`}
                                                        value={option.value}
                                                        onChange={(event) => handleOptionChangeValue(event, index, "options")} />
                                                    <Button
                                                        className="col-span-1"
                                                        variant={"destructive"}
                                                        size={"sm"}
                                                        onClick={() => handleRemoveOptionOrAnswer(option.value, index, "options")}>
                                                        <TrashIcon />
                                                    </Button>
                                                </div>
                                                {
                                                    option.errorCode && <small className="text-red-500 ml-[4rem]">{ERROR_MESSAGE[option.errorCode].message}</small>
                                                }
                                            </div>
                                        ))
                                    }
                                </div>
                                <div className="flex justify-end">
                                    <Button
                                        size={"sm"}
                                        onClick={handleAddOption} >
                                        <PlusIcon className="mr-2" /> Add Option
                                    </Button>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="optionTypes">Answer</Label>
                                {
                                    item.answers.map((answer: TOptionOrAnswer, index: number) => (
                                        <div>
                                            <Input
                                                id={`singleChoice-answer-${index}`}
                                                ref={el => {
                                                    if (answerRef?.current && el) {
                                                        answerRef.current.push(el as HTMLInputAndTextAreaElement);
                                                    }
                                                }}
                                                value={answer.value}
                                                onChange={(event) => handleOptionChangeValue(event, index, "answers")}
                                                type="text"
                                                placeholder={`Please enter you answer here.`}
                                            />
                                            {
                                                answer.errorCode && <small className="text-red-500">{ERROR_MESSAGE[answer.errorCode].message}</small>
                                            }
                                        </div>
                                    ))
                                }
                            </div>
                        </>
                    )
                }
                {
                    OPTION_TYPE.MULTIPLE_CHOICE.value === item.optionType && (
                        <>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="selectedOptionType">Option Type: <span className='text-green-700'>{item.optionType}</span></Label>
                                <div className="flex flex-col gap-2 pl-2">
                                    {
                                        item.options.map((option: TOptionOrAnswer, index: number) => {
                                            const isSelectedOption = item.answers.some((answer: TOptionOrAnswer) => answer.value === option.value);

                                            let inputProps: any = {
                                                onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => handleOptionChangeValue(event, index, "options"),
                                                disabled: false
                                            }
                                            let buttonProps: any = {
                                                onClick: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => handleRemoveOptionOrAnswer(option.value, index, "options"),
                                                disabled: false
                                            }

                                            if (isSelectedOption) {
                                                inputProps = { disabled: true };
                                                buttonProps = { disabled: true };
                                            }
                                            return (
                                                <div key={`${item.optionType}-${index}`}>
                                                    <div className="grid grid-cols-10 gap-2 items-center">
                                                        <Label
                                                            htmlFor={`option-${index}`}
                                                            className="col-span-1 justify-self-end">
                                                            Option {index + 1}
                                                        </Label>
                                                        <Input
                                                            ref={el => {
                                                                if (optionRef?.current && el) {
                                                                    optionRef.current.push(el);
                                                                }
                                                            }}
                                                            key={`option-${index}`}
                                                            className="col-span-8"
                                                            placeholder={`Enter you option ${index + 1} here.`}
                                                            value={option.value}
                                                            {...inputProps}
                                                        />
                                                        <Button
                                                            className="col-span-1"
                                                            variant={"destructive"}
                                                            size={"sm"}
                                                            {...buttonProps}
                                                        >
                                                            <TrashIcon />
                                                        </Button>
                                                    </div>
                                                    {
                                                        option.errorCode && <small className="text-red-500 ml-[5rem]">{ERROR_MESSAGE[option.errorCode].message}</small>
                                                    }
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                                <div className="flex justify-end">
                                    <Button size={"sm"} onClick={handleAddOption} ><PlusIcon className="mr-2" /> Add Option</Button>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="optionTypes">Choose Answer(s)</Label>
                                <div className="grid grid-cols-3 gap-4">
                                    {
                                        item.options.length ? item.options.map((option: TOptionOrAnswer, index: number) => (
                                            <div key={`${item.optionType}-${index}`} className="flex items-center space-x-2">
                                                <Checkbox
                                                    value={item.answers.find((answer: TOptionOrAnswer) => answer.value === option.value)?.value}
                                                    id={`checkbox-${index}`}
                                                    disabled={!option.value || !!option.errorCode}
                                                    onCheckedChange={(checked: boolean) => handleCheckBoxChange(checked, option.value)}
                                                    {...(option.errorCode ? { checked: false } : { checked: item.answers.some((answer: TOptionOrAnswer) => answer.value === option.value) })}
                                                />
                                                <label
                                                    htmlFor={`checkbox-${index}`}
                                                    className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${!option.value && "text-red-500"}`}
                                                >
                                                    {option.value || `Option ${index + 1} is empty.`}
                                                </label>
                                            </div>
                                        ))
                                            : <small className="text-red-500">No selected options(s) yet.</small>
                                    }
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="optionTypes">Selected Answer(s)</Label>
                                <div className="grid grid-cols-3 gap-4">
                                    {
                                        item.answers.length ? item.answers.map((option: TOptionOrAnswer, index: number) => (
                                            <label
                                                className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${!option.value && "text-red-500"}`}
                                            >
                                                {option.value}
                                            </label>
                                        ))
                                            : <small className="text-red-500">No selected answer(s) yet.</small>
                                    }
                                </div>
                            </div>
                        </>
                    )
                }
                {
                    OPTION_TYPE.FILL_IN_THE_BLANKS_OR_ENUMERATION.value === item.optionType && (
                        <>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="selectedOptionType">Option Type: <span className='text-green-700'>{item.optionType}</span></Label>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="optionTypes">Answer(s)</Label>
                                <div className="flex flex-col gap-2 pl-2">
                                    {
                                        item.answers.map((option: TOptionOrAnswer, index: number) => (
                                            <div key={`${item.optionType}-${index}`}>
                                                <div className="grid grid-cols-12 gap-2 items-center">
                                                    <Label htmlFor={`answer-${index + 1}`} className="col-span-2 justify-self-end">Answer {index + 1}</Label>
                                                    <Input
                                                        ref={el => {
                                                            if (answerRef?.current && el) {
                                                                answerRef.current.push(el as HTMLInputAndTextAreaElement);
                                                            }
                                                        }}
                                                        id={`answer-${index + 1}`}
                                                        className="col-span-9"
                                                        placeholder={`Enter your answer ${index + 1} here.`}
                                                        value={option.value}
                                                        onChange={(event) => handleOptionChangeValue(event, index, "answers")} />
                                                    <Button
                                                        className="col-span-1"
                                                        variant={"destructive"}
                                                        size={"sm"}
                                                        onClick={() => handleRemoveOptionOrAnswer(option.value, index, "answers")}>
                                                        <TrashIcon />
                                                    </Button>
                                                </div>
                                                {
                                                    option.errorCode && <small className="text-red-500 ml-[7rem]">{ERROR_MESSAGE[option.errorCode].message}</small>
                                                }
                                            </div>
                                        ))
                                    }
                                    {
                                        !item.answers.length && <small className="text-red-500">No answer has been added yet.</small>
                                    }
                                </div>
                                <div className="flex justify-end">
                                    <Button size={"sm"} onClick={handleAddAnotherAnswer} ><PlusIcon className="mr-2" /> Add Answer</Button>
                                </div>
                            </div>
                        </>
                    )
                }
                {
                    OPTION_TYPE.TRUE_OR_FALSE.value === item.optionType && (
                        <>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="selectedOptionType">Option Type: <span className='text-green-700'>{item.optionType}</span></Label>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="optionTypes">Answer(s)</Label>
                                <div className="pl-2">
                                    <RadioGroup className='flex gap-6'>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="true" id={`${item.optionType}-true`} />
                                            <Label htmlFor={`${item.optionType}-true`}>True</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="false" id={`${item.optionType}-false`} />
                                            <Label htmlFor={`${item.optionType}-false`}>False</Label>
                                        </div>
                                    </RadioGroup>
                                </div>
                            </div>
                        </>
                    )
                }
                {
                    OPTION_TYPE.EXPLANATION.value === item.optionType && (
                        <>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="selectedOptionType">Option Type: <span className='text-green-700'>{item.optionType}</span></Label>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="optionTypes">Answer(s)</Label>
                                {
                                    item.answers.map((answer: TOptionOrAnswer) => (
                                        <div>
                                            <Textarea
                                                ref={(el) => {
                                                    if (answerRef?.current && el) {
                                                        answerRef.current.push(el as HTMLInputAndTextAreaElement);
                                                    }
                                                }}
                                                key="answerExplanation"
                                                placeholder="Type your explained answer here. . ." id="explanation" rows={5} value={answer.value}
                                                onChange={(event) => handleOptionChangeValue(event, 0, "answers")}
                                            />
                                            {
                                                answer.errorCode && <small className="text-red-500">{ERROR_MESSAGE[answer.errorCode].message}</small>
                                            }
                                        </div>
                                    ))
                                }
                            </div>
                        </>
                    )
                }
                <hr />
                <div className="flex flex-col gap-2">
                    <Label htmlFor="optionTypes">Image</Label>
                    <Input id="picture" type="file" />
                </div>
            </CardContent>
            <CardFooter className="flex justify-between">
                <Button variant="outline">Cancel</Button>
                <Button onClick={handleSaveItem}>Save</Button>
            </CardFooter>
        </Card>
    )
}

export default ItemCard;