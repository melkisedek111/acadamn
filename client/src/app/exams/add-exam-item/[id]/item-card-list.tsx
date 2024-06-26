"use client";

import React, { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeftIcon, PlusIcon } from '@radix-ui/react-icons'
import Link from 'next/link'
import ItemCard from './item-card'
import { deleteExamItem, deleteSpecificExamItemImage, TExamItem } from './action'
import { TItem } from './useItemCard'
import { useToast } from '@/components/ui/use-toast'
import { signOut } from 'next-auth/react'
import useErrorHandler from '@/hooks/useErrorHandler';

const ItemCardList = (props: { examItems: TExamItem[], id: string }) => {
    const { toast } = useToast();
    const { handleNoError } = useErrorHandler();
    const [items, setItems] = useState<TItem[]>([]);
    const examItemRef = useRef<HTMLDivElement>(null);
    const [selectedItemCodeId, setSelectedItemCodeId] = useState<string | undefined>(undefined);

    function generateID(): string {
        const prefix = 'ITEM-';
        const randomDigits1 = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        const randomDigits2 = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        const milliseconds = Date.now().toString();
        return `${prefix}${randomDigits1}-${randomDigits2}-${milliseconds}`;
    }

    const handleAddNewItem = (): void => {
        const newItem: TItem = {
            isEdit: true,
            count: items.length + 1,
            itemCodeId: generateID(),
            questionType: "",
            question: "",
            hasCode: false,
            code: "",
            codeLanguage: "",
            optionType: "",
            options: [],
            answers: [],
            image: undefined,
            errors: {
                questionType: false,
                question: false,
                code: false,
                codeLanguage: false,
                optionType: false,
                image: false,
            }
        }

        setItems([...items, newItem]);
    }

    const getColumns = (columnIndex: number) => {
        return items.filter((item: TItem, index: number) => index % 2 === columnIndex);
    }

    const handleHoveredItemCard = (event: React.MouseEvent<HTMLDivElement>) => {
        const parentElement = event.currentTarget as HTMLDivElement;
        const classList = Array.from(parentElement.classList);
        const itemCardClassName = classList.find(className => className.includes("itemCard"));
        const itemCodeId = itemCardClassName?.split("itemCard-")[1];
        setSelectedItemCodeId(itemCodeId);
    }

    const handleUnHoveredItemCard = () => {
        setSelectedItemCodeId(undefined);
    }

    const handleUpdateSetItems = (item: TExamItem) => {
        const exitedItems = [...items];
        const selectedItems = exitedItems.find(thisItem => thisItem.itemCodeId === item.itemCodeId);

        if (selectedItems) {

            const modifiedItems = exitedItems.filter(thisItem => thisItem.itemCodeId !== item.itemCodeId);
            const updatedItem: TItem = {
                id: item.id,
                isEdit: false,
                count: selectedItems.count,
                itemCodeId: item.itemCodeId,
                questionType: item.itemType,
                question: item.question,
                hasCode: item.hasCode,
                code: item.code,
                codeLanguage: item.codeLanguage,
                optionType: item.optionType,
                options: item.options.map((i: string) => ({ value: i, errorCode: "" })),
                answers: item.answers.map((i: string) => ({ value: i, errorCode: "" })),
                image: item.images,
                errors: {
                    questionType: false,
                    question: false,
                    code: false,
                    codeLanguage: false,
                    optionType: false,
                    image: false,
                },
            }

            const sortedItems = [...modifiedItems, updatedItem].sort((a, b) => a.count! - b.count!);
            setItems(sortedItems);
        }
    }

    const handleDeleteExamItem = async (itemId: number, examId: number) => {
        try {
            if (itemId) {
                const existedItems = JSON.parse(JSON.stringify([...items]));
                const response = await deleteExamItem(itemId, examId);

                if ("error" in response) {
                    for (const error of response.details) {
                        toast({
                            variant: "destructive",
                            title: "Delete Exam Item Failed",
                            description: error.message,
                        })
                    }

                    return;
                }

                const modifiedItems = [...existedItems].filter(thisItem => thisItem.id !== itemId).sort((a, b) => a.count! - b.count!);
                setItems([...modifiedItems]);

                toast({
                    variant: "default",
                    title: "Delete Exam Item Failed",
                    description: "Exam Item has been deleted.",
                })
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleDeleteSpecificExamItemImage = async (id: number, imageName: string, examId: number) => {
        const deletedImage = await deleteSpecificExamItemImage(id, imageName, examId);

        const hasNoError = handleNoError(deletedImage, "Deleting Image");

        if (hasNoError) {
            const existedItems = JSON.parse(JSON.stringify([...items]));

            const modifiedItems = existedItems.map((item: TItem)=> {
                if (item.id === id) {
                    const updateImages = item.image.filter((image: string) => image !== imageName);
                    item.image = updateImages;
                }

                return item;
            })

            toast({
                variant: "default",
                description: "Image(s) has been updated",
            }) 

            setItems([...modifiedItems]);
        }
    }

    const handleCancelNewExamItem = (itemCodeId: string) => {
        const existedItems = JSON.parse(JSON.stringify([...items]));
        const modifiedItems = [...existedItems].filter(thisItem => thisItem.itemCodeId !== itemCodeId);
        setSelectedItemCodeId(undefined);
        setItems([...modifiedItems]);
    }

    useEffect(() => {
        (async () => {
            const existedItems: TItem[] = [];
            for (const item of props.examItems) {
                existedItems.push({
                    id: item.id,
                    isEdit: false,
                    count: existedItems.length + 1,
                    itemCodeId: item.itemCodeId,
                    questionType: item.itemType,
                    question: item.question,
                    hasCode: item.hasCode,
                    code: item.code,
                    codeLanguage: item.codeLanguage,
                    optionType: item.optionType,
                    options: item.options.map(i => ({ value: i, errorCode: "" })),
                    answers: item.answers.map(i => ({ value: i, errorCode: "" })),
                    image: item.images,
                    errors: {
                        questionType: false,
                        question: false,
                        code: false,
                        codeLanguage: false,
                        optionType: false,
                        image: false,
                    },
                })
            }
            setItems(existedItems)
        })()
    }, [])

    useEffect(() => {
        if (examItemRef.current) {
            window.scrollTo({ top: examItemRef.current.scrollHeight, behavior: "smooth" })
        }
    }, [items]);

    return (
        <div className='pb-10' ref={examItemRef}>
            <div className="my-5 flex items-center justify-between">
                <h1 className="text-3xl font-bold ">Add New Item</h1>
                <Button asChild>
                    <Link href={"/exams"}>
                        <ArrowLeftIcon className="mr-2" />
                        Back
                    </Link>
                </Button>
            </div>

            <div className="grid grid-cols-2 gap-4 h-full overflow-y-auto">
                {[
                    getColumns(0),
                    getColumns(1),
                ].map((items, index) =>
                    <div key={index} className="flex flex-col gap-2">
                        {
                            items.map((item: TItem, index: number) => (
                                <ItemCard
                                    className={`itemCard-${item.itemCodeId} group/itemCard hover:border-green-500 transition duration-300 ease-in-out ${selectedItemCodeId !== item.itemCodeId && selectedItemCodeId !== undefined ? "filter blur-[2px]" : ""}`}
                                    onMouseEnter={handleHoveredItemCard}
                                    onMouseLeave={handleUnHoveredItemCard}
                                    key={Number(props.id) + index}
                                    item={item} itemNumber={index}
                                    examId={Number(props.id)}
                                    handleUpdateSetItems={handleUpdateSetItems}
                                    handleDeleteExamItem={handleDeleteExamItem}
                                    handleCancelNewExamItem={handleCancelNewExamItem}
                                    handleDeleteSpecificExamItemImage={handleDeleteSpecificExamItemImage}
                                />
                            ))
                        }
                    </div>
                )
                }
            </div>
            <div className="fixed bottom-10 right-10">
                <Button
                    size={"lg"}
                    className="font-bold text-lg py-2 px-4 rounded-full shadow-lg fixed-button"
                    onClick={handleAddNewItem}
                >
                    <PlusIcon className="mr-2" /> Add Item
                </Button>
            </div>
        </div>
    )
}

export default ItemCardList