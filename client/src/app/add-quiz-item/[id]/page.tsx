"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeftIcon, PlusIcon } from '@radix-ui/react-icons'
import Link from 'next/link'
import ItemCard, { TItem } from '@/components/item.card'



const AddQuizItem = ({ params }: { params: { id: string } }) => {
    const [items, setItems] = useState<TItem[]>([]);

    function generateID(): string {
        const prefix = 'ITEM-';
        const randomDigits1 = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        const randomDigits2 = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        const milliseconds = Date.now().toString();
        return `${prefix}${randomDigits1}-${randomDigits2}-${milliseconds}`;
    }

    const handleAddNewItem = (): void => {
        const newItem: TItem = {
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
            }
        }

        const handleSaveItem = (newItem: TItem) => {
            const modifiedItems = [...items];

            for(let item of modifiedItems) {
                if(item.itemCodeId === newItem.itemCodeId) {
                    item = newItem;
                }
            }

            setItems(modifiedItems);
        }

        setItems([...items, newItem]);
    }

    const getColumns = (columnIndex: number) => {
        return items.filter((item: TItem, index: number) => index % 2 === columnIndex);
    }

    return (
        <div className='pb-10'>
            <div className="my-5 flex items-center justify-between">
                <h1 className="text-3xl font-bold ">Add New Item</h1>
                <Button asChild>
                    <Link href={"/quizzes"}>
                        <ArrowLeftIcon className="mr-2" />
                        Back
                    </Link>
                </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {[
                    getColumns(0),
                    getColumns(1),
                ].map((items, index) =>
                    <div key={index} className="flex flex-col gap-2">
                        {
                            items.map((item: TItem) => (
                                <ItemCard item={item} itemNumber={index} />
                            ))
                        }
                    </div>)
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

export default AddQuizItem