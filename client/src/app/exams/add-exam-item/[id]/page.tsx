"use server"
import React from 'react'
import { getExamItems } from './action'
import ItemCardList from './item-card-list'
import { unstable_noStore } from 'next/cache'
import CustomBreadcrumb from '@/components/custom-breadcrumb'
import { LinkDetails } from '@/constants/app.constants'
import { Metadata } from 'next'
import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'

export async function generateMetadata(): Promise<Metadata> {
    const session = await getSession();
    if (!session) redirect("/logout")

    return {
        title: "Add New Item",
        description: "Add new item to the selected exam.",
    }
}

const AddQuizItem = async ({ params }: { params: { id: string } }) => {
    unstable_noStore();
    const examItems = await getExamItems(Number(params.id));

    return (
        <div>
            <CustomBreadcrumb subLink={LinkDetails.exams} currentTitle="Add New Item" />
            <ItemCardList examItems={examItems} id={params.id} />
        </div>
    )
}

export default AddQuizItem