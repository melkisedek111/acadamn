"use client";

import React, { ComponentProps, useEffect, useReducer, useRef, useState } from 'react'
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
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
import { createExamItem, TCreateExamItemParams, TExamItem } from './action';
import { useToast } from '@/components/ui/use-toast';
import { signOut } from 'next-auth/react';

import ItemCardView from './item-card-view';
import { CODE_LANGUAGES, OPTION_TYPE, QUESTION_TYPE } from '@/constants/app.constants';
import { ActionTypes, ItemReducer } from './reducer';

export type TErrorCode = "" | "EMPTY" | "VALUE_EXISTS";

export type TOptionOrAnswer = {
    value: string;
    errorCode: TErrorCode;
}

export type TItemError = {
    questionType: boolean;
    question: boolean;
    code: boolean;
    codeLanguage: boolean;
    optionType: boolean;
    image: boolean;
}

export type TItem = {
    isEdit?: boolean;
    id?: number;
    count?: number;
    itemCodeId: string;
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

const ITEM_ERROR_MESSAGE = {
    questionType: "Question type is required.",
    question: "Question question is required.",
    code: "Code is required",
    codeLanguage: "Language is required.",
    optionType: "Question option type is required.",
    image: "Image should be JPEG, JPG or PNG format and must be a 5MB max file size."
}

export const ERROR_MESSAGE: {
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

type TItemCardProps = ComponentProps<"div"> & {
    item: TItem;
    itemNumber: number;
    examId: number;
    handleUpdateSetItems: (item: TExamItem) => void;
    className?: string;
}

const ItemCard = ({ item: itemProp, itemNumber: itemNumberProp, examId: examIdProp, handleUpdateSetItems: handleUpdateSetItemsProp, ...otherProps }: TItemCardProps) => {
    const props = {
        item: itemProp,
        itemNumber: itemNumberProp,
        examId: examIdProp,
        handleUpdateSetItems: handleUpdateSetItemsProp
    }
    const [item, dispatch] = useReducer(ItemReducer, props.item);
    const [isEdit, setIsEdit] = useState<boolean | undefined>(props.item.isEdit);
    const optionRef = useRef<HTMLInputElement[]>([]);
    const { toast } = useToast();
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
    const handleGetImage = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files?.length) {
            dispatch({ type: ActionTypes.GET_IMAGE, payload: { value: event.target.files } });
        }
    }

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

    const handleSaveItem = async () => {
        dispatch({ type: ActionTypes.SAVE_ITEM });
        const currentItem = item as TItem;

        if (!Object.values(currentItem.errors).includes(true) && !currentItem.answers.find(item => item.errorCode) && !currentItem.options.find(item => item.errorCode)) {

            const itemDetails: TCreateExamItemParams = {
                itemCodeId: currentItem.itemCodeId,
                examId: props.examId,
                itemType: currentItem.questionType,
                question: currentItem.question,
                hasCode: currentItem.hasCode,
                code: currentItem.code,
                codeLanguage: currentItem.codeLanguage,
                optionType: currentItem.optionType,
                options: currentItem.options.map(item => item.value),
                answers: currentItem.answers.map(item => item.value)
            }
            const formData = new FormData();

            for (let index = 0; currentItem.image?.length > index; index++) {
                formData.append(`image-${index + 1}`, currentItem.image[index]);
            }

            const images = {
                imageCount: currentItem.image?.length || 0,
                formData
            }

            const response = await createExamItem(itemDetails, images);

            if ("error" in response) {

                if (response.error === "Unauthenticated") {
                    signOut();
                    return;
                }

                for (const error of response.details) {
                    toast({
                        variant: "destructive",
                        title: "Create Exam Item Failed",
                        description: error.message,
                    })
                }

                return;
            }

            props.handleUpdateSetItems(response);

            toast({
                variant: "default",
                title: "Exam Item Created!",
                description: "Exam Item created successfully!",
            })
        }
    }

    const handleEditItem = () => {
        setIsEdit(!isEdit)
    }

    useEffect(() => {
        // statement for focusing the input for both answer and options when remove or add
        if (item.answers.length && answerRef.current) {
            answerRef.current[answerRef.current?.length - 1]?.scrollIntoView({ behavior: 'smooth' });
            answerRef.current[answerRef.current?.length - 1]?.focus();
        }
    }, [item.answerRef])

    useEffect(() => {
        // statement for focusing the input for both answer and options when remove or add
        if (item.options.length && optionRef.current) {
            optionRef.current[optionRef.current?.length - 1]?.scrollIntoView({ behavior: 'smooth' });
            optionRef.current[optionRef.current?.length - 1]?.focus();
        }
    }, [item.optionRef])

    useEffect(() => {
        setIsEdit(props.item.isEdit)
    }, [props.item])

    return (
        <div>
            {
                isEdit ? (
                    <Card {...otherProps}>
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
                                                                    <SelectItem key={`code_question-${item.value}`} value={item.value}>{item.label}</SelectItem>
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
                                                                defaultLanguage={item.codeLanguage}
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
                                                        key={`option_types-${item.value}`}
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
                                                                    id={`singleChoice-option-${index}`}
                                                                    ref={el => {
                                                                        if (optionRef?.current && el) {
                                                                            optionRef.current.push(el as HTMLInputAndTextAreaElement);
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
                                                    <div key={`singleChoice_answer-${answer.value}`}>
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
                                                        <div key={`multiple_choice_${item.optionType}-${index}`} className="flex items-center space-x-2">
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
                                                            key={`multiple_choice_${option.value}-${index}`}
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
                                                        <div key={`fill_in_the_blank_${item.optionType}-${index}`}>
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
                                                    <div key={`explanation-${answer.value}`}>
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
                                <Input id="picture" type="file" multiple onChange={handleGetImage} />
                                {
                                    item.errors.image && (<small className="text-red-500">{ITEM_ERROR_MESSAGE.image}</small>)
                                }
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <Button onClick={handleEditItem} variant="outline">Cancel</Button>
                            <Button onClick={handleSaveItem}>Save</Button>
                        </CardFooter>
                    </Card>
                ) : <ItemCardView item={item} itemId={props.item.id} examId={props.examId} handleEditItem={handleEditItem} {...otherProps}/>
            }
        </div>
    )
}

export default ItemCard;