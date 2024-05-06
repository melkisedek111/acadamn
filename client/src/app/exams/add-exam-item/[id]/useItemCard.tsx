"use client";
import React, { ComponentProps, useEffect, useReducer, useRef, useState } from 'react'
import { createExamItem, deleteSpecificExamItemImage, TCreateExamItemParams, TExamItem, updateExamItem } from './action';
import { ActionTypes, ItemReducer } from './reducer';
import { useToast } from '@/components/ui/use-toast';
import { signOut } from 'next-auth/react';
import { OPTION_TYPE } from '@/constants/app.constants';
import useErrorHandler from '@/hooks/useErrorHandler';

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
    readImageSource?: string[];
    errors: TItemError
}

export const ITEM_ERROR_MESSAGE = {
    questionType: "Question type is required.",
    question: "Question question is required.",
    code: "Code is required",
    codeLanguage: "Language is required.",
    optionType: "Question option type is required.",
    image: "Image should be JPEG, JPG or PNG format and must be a 3MB max file size."
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

export type HTMLInputAndTextAreaElement = HTMLInputElement & HTMLTextAreaElement;

export type TUseItemCardProps = {
    item: TItem;
    itemNumber: number;
    examId: number;
    handleUpdateSetItems: (item: TExamItem) => void;
}

const useItemCard = (props: TUseItemCardProps) => {
    const { toast } = useToast();
    const [item, dispatch]: [TItem, any] = useReducer(ItemReducer, props.item);
    const [isEdit, setIsEdit] = useState<boolean | undefined>(props.item.isEdit);
    const [isCreated, setIsCreated] = useState<boolean>(false);
    const [isUpdate, setIsUpdate] = useState<boolean>(false);
    const optionRef = useRef<HTMLInputElement[]>([]);
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
    const handleRadioChange = (value: string) => dispatch({ type: ActionTypes.ADD_ANSWER_BY_RADIO, payload: { value } });
    const handleGetImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files?.length) {
            const files = Array.from(event.target.files);
            const imageFiles = files.filter((file: any) => file.type.startsWith('image/'));
            const imageSources: any = [];
            const imagePromises = imageFiles.map(file => {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        resolve(event?.target?.result);
                    };
                    reader.onerror = (error) => {
                        reject(error);
                    };
                    reader.readAsDataURL(file);
                });
            });

            const dataUrls = await Promise.all(imagePromises)
            imageSources.push(...dataUrls);
            dispatch({ type: ActionTypes.GET_IMAGE, payload: { value: event.target.files, imageSrc: imageSources } });
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
        setIsCreated(true);
    }

    const handleEditItem = () => {
        setIsEdit(!isEdit);
        dispatch({ type: ActionTypes.UPDATE_STATE, payload: { updatedState: props.item } });
    }

    const handleUpdateExamItem = () => {
        dispatch({ type: ActionTypes.SAVE_ITEM });
        setIsUpdate(true);
    }

    useEffect(() => {
        // statement for focusing the input for both answer and options when remove or add
        if (item.answers.length && answerRef.current) {
            answerRef.current[answerRef.current?.length - 1]?.scrollIntoView({ behavior: 'smooth' });
            answerRef.current[answerRef.current?.length - 1]?.focus();
        }
    }, [answerRef])

    const handleOptionsAnswerEmpty = (optionType: string) => {
        if (optionType === OPTION_TYPE.SINGLE_CHOICE.value || optionType === OPTION_TYPE.MULTIPLE_CHOICE.value) {
            return item.options.length && item.answers.length;
        } else if (optionType === OPTION_TYPE.TRUE_OR_FALSE.value || optionType === OPTION_TYPE.FILL_IN_THE_BLANKS_OR_ENUMERATION.value || optionType === OPTION_TYPE.EXPLANATION.value) {
            return item.answers.length;
        }

        return true;
    }


    useEffect(() => {
        // statement for focusing the input for both answer and options when remove or add
        if (item.options.length && optionRef.current) {
            optionRef.current[optionRef.current?.length - 1]?.scrollIntoView({ behavior: 'smooth' });
            optionRef.current[optionRef.current?.length - 1]?.focus();
        }
    }, [optionRef])

    useEffect(() => {
        setIsEdit(props.item.isEdit)
        dispatch({ type: ActionTypes.UPDATE_STATE, payload: { updatedState: props.item } });
    }, [props.item])

    const saveOrUpdateItem = async (method: string) => {
        const currentItem = item as TItem;

        if (
            currentItem.question &&
            !Object.values(currentItem.errors).includes(true) &&
            !currentItem.answers.find(item => item.errorCode) &&
            !currentItem.options.find(item => item.errorCode) &&
            handleOptionsAnswerEmpty(currentItem.optionType)
        ) {

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
                if (currentItem.image[index] instanceof File) {
                    formData.append(`image-${index + 1}`, currentItem.image[index]);
                }
            }

            const images = {
                imageCount: currentItem.image?.length || 0,
                formData
            }

            let response = undefined;

            if (method.toLowerCase() === "created") {
                response = await createExamItem(itemDetails, images);
            } else if (method.toLowerCase() === "updated") {
                response = await updateExamItem({ ...itemDetails, id: currentItem.id }, images);
            }

            if (response) {
                if ("error" in response) {
                    for (const error of response.details) {
                        toast({
                            variant: "destructive",
                            title: "Exam Item Failed",
                            description: error.message,
                        })
                    }
                    return;
                }

                props.handleUpdateSetItems(response);

            }

            toast({
                variant: "default",
                title: `Exam Item ${method}!`,
                description: `Exam Item ${method.toLowerCase()} successfully!`,
            })
        }
    }

    useEffect(() => {
        (async function () {
            if (isCreated) {
                await saveOrUpdateItem("Created");
                setIsCreated(false);
            }

            if (isUpdate) {
                await saveOrUpdateItem("Updated");
                setIsUpdate(false);
            }
        })()
    }, [isCreated, isUpdate])

    return {
        item, isEdit, optionRef, answerRef, handleValueChange, handleAddOption,
        handleAddAnotherAnswer,
        handleTextAreaChange,
        handleCheckBoxChange,
        handleGetImage, 
        handleRemoveOptionOrAnswer, 
        handleOptionChangeValue,
        handleSaveItem, 
        handleEditItem, 
        handleUpdateExamItem,
        handleRadioChange
    }
}

export default useItemCard;