"use client";
import React, { ComponentProps } from 'react'

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';

import Editor from "@monaco-editor/react";
import { Separator } from '@/components/ui/separator';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import Image from 'next/image';
import { TrashIcon } from '@radix-ui/react-icons';
import { TItem } from './useItemCard';
import { deleteExamItem } from './action';
import { useToast } from '@/components/ui/use-toast';
import { signOut } from 'next-auth/react';
import { redirect, useRouter } from 'next/navigation';

type TItemCardViewProps = ComponentProps<"div"> & {
    item: TItem;
    itemId: number | undefined;
    examId: number;
    handleEditItem: () => void;
    handleDeleteExamItem: (itemId: number, examId: number) => void;
    handleDeleteSpecificExamItemImage: (id: number, imageName: string, examId: number) => void;
}

const ItemCardView = ({ item: itemProp, itemId: itemIdProp, examId: examIdProp, handleEditItem, handleDeleteExamItem, handleDeleteSpecificExamItemImage, ...otherProps }: TItemCardViewProps) => {
    const props = {
        item: itemProp,
        itemId: itemIdProp,
        examId: examIdProp,
    }

    return (
        <Card {...otherProps}>
            <CardHeader className="py-4 flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="text-lg">{props.item.question}</CardTitle>
                    <div className="flex h-5 items-center space-x-4 text-sm">
                        <small>Question {props.item.count}</small>
                        <Separator orientation="vertical" />
                        <small>Type: <span className="font-bold">{props.item.questionType}</span></small>
                    </div>
                </div>

                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant={"destructive"} size={"sm"} className="hidden transition duration-500 ease-in-out group-hover/itemCard:block">
                            <TrashIcon />
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                <p>This action cannot be undone. This will permanently delete the selected question/item.</p>
                                <p className="text-lg font-semibold text-red-500">"{props.item.question}"</p>
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => {
                                if (props.itemId) {
                                    handleDeleteExamItem(props.itemId, props.examId);
                                }
                            }}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </CardHeader>
            <hr />
            <CardContent className='flex flex-col gap-2 mt-2'>
                {
                    props.item.hasCode ? (
                        <div>
                            <p className="text-sm text-muted-foreground">Code Language: <span className="font-bold text-black">{props.item.codeLanguage.toUpperCase()}</span></p>
                            <p className="text-sm text-muted-foreground">Code:</p>
                            <div className="overlay rounded-md overflow-hidden w-full h-full shadow-4xl">
                                <Editor
                                    options={{ readOnly: true }}
                                    height={"200px"}
                                    width={`100%`}
                                    language={props.item.codeLanguage}
                                    defaultLanguage={props.item.codeLanguage}
                                    value={props.item.code}
                                    theme={"vs-dark"}
                                />
                            </div>
                        </div>
                    ) : null
                }
                <div>
                    <p className="text-sm text-muted-foreground">Options:</p>
                    <div className='ml-2 flex flex-col gap-2'>
                        {
                            props.item.options.map((option, index) => (
                                <p key={`view_options-${option.value}-${index}`} className="text-sm">Option {index + 1} : <span className="font-bold">{option.value.toUpperCase()}</span></p>
                            ))
                        }
                    </div>
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">Answers:</p>
                    <div className='ml-2 flex flex-col gap-2'>
                        {
                            props.item.answers.map((answer, index) => (
                                <p key={`view_answer-${answer.value}`} className="text-sm text-green-500">Answer {index + 1} : <span className="font-bold">{answer.value.toUpperCase()}</span></p>
                            ))
                        }
                    </div>
                </div>
                {
                    props.item.image?.length ? (
                        <div className="flex items-start justify-center">
                            <PhotoProvider>
                                <Carousel className="w-full max-w-sm" opts={{
                                    align: "start",
                                }}>
                                    <CarouselContent className="-ml-1">
                                        {props.item.image.map((image: string, index: number) => (
                                            <CarouselItem key={`carousel-${index}`} className="pl-1 md:basis-1/2 lg:basis-1/3">
                                                <div className="p-1 group relative">
                                                    <button
                                                        className="hidden group-hover:block absolute top-2 right-2 p-1 rounded-md shadow-md bg-red-500 text-white"
                                                        onClick={() => {
                                                            if (props.item.id) {
                                                                handleDeleteSpecificExamItemImage(props.item.id, image, props.examId);
                                                            }
                                                        }}
                                                    >
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
                    ) : null
                }

            </CardContent>
            <CardFooter className="flex justify-end">
                <Button onClick={handleEditItem}>Edit</Button>
            </CardFooter>
        </Card>
    )
}

export default ItemCardView;