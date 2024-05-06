"use client";

import React, { ComponentProps, useEffect, useState } from 'react'
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
import ItemCardView from './item-card-view';
import { CODE_LANGUAGES, OPTION_TYPE, QUESTION_TYPE } from '@/constants/app.constants';
import useItemCard, { ERROR_MESSAGE, HTMLInputAndTextAreaElement, ITEM_ERROR_MESSAGE, TItem, TOptionOrAnswer, TUseItemCardProps } from './useItemCard';
import { TExamItem } from './action';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import Image from 'next/image';
import { PhotoProvider, PhotoView } from 'react-photo-view';

type TItemCardProps = ComponentProps<"div"> & {
    item: TItem;
    itemNumber: number;
    examId: number;
    handleUpdateSetItems: (item: TExamItem) => void;
    handleDeleteExamItem: (itemId: number, examId: number) => void;
    handleCancelNewExamItem: (itemCodeId: string) => void;
    handleDeleteSpecificExamItemImage: (id: number, imageName: string, examId: number) => void;
};

const ItemCard = ({ item: itemProp, itemNumber, examId, handleUpdateSetItems, handleDeleteExamItem, handleCancelNewExamItem, handleDeleteSpecificExamItemImage, ...otherProps }: TItemCardProps) => {
    const props = {
        item: itemProp,
        itemNumber,
        examId,
        handleUpdateSetItems,
    };

    const {
        item, isEdit, optionRef, answerRef,
        handleValueChange, handleAddOption,
        handleAddAnotherAnswer,
        handleTextAreaChange,
        handleCheckBoxChange,
        handleGetImage,
        handleRemoveOptionOrAnswer,
        handleOptionChangeValue,
        handleSaveItem,
        handleUpdateExamItem,
        handleEditItem,
        handleRadioChange
    } = useItemCard(props);
    
    const isSomeChanges = JSON.stringify(itemProp) === JSON.stringify(item);

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
                                    <Textarea disabled={!item.questionType} value={item.question} placeholder="Type your question here." id="question" rows={5} onChange={handleTextAreaChange} />
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
                                    <SelectTrigger disabled={!item.questionType}>
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
                                            {
                                                item.options.length ? null : <small className="text-red-500">No input options(s) yet.</small>
                                            }
                                            <div className="flex justify-end">
                                                <Button
                                                    size={"sm"}
                                                    onClick={handleAddOption} >
                                                    <PlusIcon className="mr-2" /> Add Option
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <Label htmlFor="optionTypes">Choose Answer(s)</Label>
                                            <RadioGroup className="grid grid-cols-3 gap-4" value={item.answers[0]?.value} onValueChange={handleRadioChange}>
                                                {
                                                    item.options.length ? item.options.map((option: TOptionOrAnswer, index: number) => (
                                                        option.value ? <div className="flex items-center space-x-2" key={`single_choice_${item.optionType}-${index}`}>
                                                            <RadioGroupItem
                                                                value={option.value}
                                                                id={`single_choice_radio-${index}`}
                                                                disabled={!option.value || !!option.errorCode}
                                                            />
                                                            <Label htmlFor={`single_choice_radio-${index}`} className={`cursor-pointer ${item.answers[0]?.value === option.value ? "text-green-500" : ""}`}>{option.value}</Label>
                                                        </div> : null
                                                    )) : null
                                                }
                                            </RadioGroup>
                                            {
                                                item.answers[0]?.value ? null : <small className="text-red-500">No selected answers(s) yet.</small>
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
                                            {
                                                item.options.length ? null : <small className="text-red-500">No input options(s) yet.</small>
                                            }
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
                                                <RadioGroup className='flex gap-6' value={item.answers[0]?.value} onValueChange={handleRadioChange}>
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
                                            {
                                                item.answers.length ? null : <small className="text-red-500">No selected answers(s) yet.</small>
                                            }
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
                                <Input disabled={!item.questionType} id="picture" type="file" multiple onChange={handleGetImage} />
                                {
                                    item.errors.image && (<small className="text-red-500">{ITEM_ERROR_MESSAGE.image}</small>)
                                }
                                {
                                    item?.readImageSource?.length ? (
                                        <div className="flex items-start justify-center">
                                            <PhotoProvider>
                                                <Carousel className="w-full max-w-sm" opts={{
                                                    align: "start",
                                                }}>
                                                    <CarouselContent className="-ml-1">
                                                        {item?.readImageSource?.map((image: string, index: number) => (
                                                            <CarouselItem key={`carousel-${index}`} className="pl-1 md:basis-1/2 lg:basis-1/3">
                                                                <div className="p-1 group relative">
                                                                    <PhotoView src={image}>
                                                                        <Card>
                                                                            <CardContent className="flex aspect-square items-center justify-center p-1" >
                                                                                <Image
                                                                                    src={image}
                                                                                    alt={"img"}
                                                                                    width={500}
                                                                                    height={500}
                                                                                    className="object-cover w-full h-full"
                                                                                />
                                                                            </CardContent>
                                                                        </Card>
                                                                    </PhotoView>
                                                                </div>
                                                            </CarouselItem>
                                                        ))}
                                                    </CarouselContent>
                                                    <CarouselPrevious />
                                                    <CarouselNext />
                                                </Carousel>
                                            </PhotoProvider>
                                        </div>
                                    ) : null
                                }
                                {
                                    item?.id && item?.image?.length ? (
                                        <div>
                                            <p>Existed Images</p>
                                            <div className='flex items-start justify-center'>
                                                <PhotoProvider>
                                                    <Carousel className="w-full max-w-sm" opts={{
                                                        align: "start",
                                                    }}>
                                                        <CarouselContent className="-ml-1">
                                                            {props.item.image.map((image: string, index: number) => (
                                                                <CarouselItem key={`carousel-${index}`} className="pl-1 md:basis-1/2 lg:basis-1/3">
                                                                    <div className="p-1 group relative">
                                                                        <button className="hidden group-hover:block absolute top-2 right-2 p-1 rounded-md shadow-md bg-red-500 text-white">
                                                                            <TrashIcon />
                                                                        </button>
                                                                        <PhotoView src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/exam-item/${image}`}>
                                                                            <Card>
                                                                                <CardContent className="flex aspect-square items-center justify-center p-1" >
                                                                                    <Image
                                                                                        src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/exam-item/${image}`}
                                                                                        alt={"img"}
                                                                                        width={500}
                                                                                        height={500}
                                                                                        className="object-cover w-full h-full"
                                                                                    />

                                                                                </CardContent>
                                                                            </Card>
                                                                        </PhotoView>
                                                                    </div>
                                                                </CarouselItem>
                                                            ))}
                                                        </CarouselContent>
                                                        <CarouselPrevious />
                                                        <CarouselNext />
                                                    </Carousel>
                                                </PhotoProvider>
                                            </div>
                                        </div>
                                    ) : null
                                }
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            {
                                item?.id ? <Button onClick={handleEditItem} variant="outline">Cancel</Button> : <Button onClick={() => { handleCancelNewExamItem(item.itemCodeId) }} variant="outline">Cancel</Button>
                            }
                            {
                                item?.id && isEdit ? <Button disabled={isSomeChanges} onClick={handleUpdateExamItem}>Update</Button> : <Button onClick={handleSaveItem}>Save</Button>
                            }

                        </CardFooter>
                    </Card>
                ) : <ItemCardView
                    item={props.item}
                    itemId={props.item.id}
                    examId={props.examId}
                    handleEditItem={handleEditItem}
                    handleDeleteExamItem={handleDeleteExamItem}
                    handleDeleteSpecificExamItemImage={handleDeleteSpecificExamItemImage}
                    {...otherProps}
                />
            }
        </div>
    )
}

export default ItemCard;