"use server"
import CustomBreadcrumb from '@/components/custom-breadcrumb'
import { LinkDetails } from '@/constants/app.constants'
import type { Metadata, ResolvingMetadata } from 'next'
import { MyStudentTable } from './my-student-table'
import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { getSubjects } from '../subjects/action'
import { TCustomSelectDropdownData } from '@/components/customs/custome-select'

type Props = {
    params: { id: string }
    searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(): Promise<Metadata> {
    const session = await getSession();
    if (!session) redirect("/logout");
    
    return {
        title: "My Students",
        description: "List of the handled students"
    }
}

export default async function MyStudents() {
    const subjects = await getSubjects();
    const selectedSubjects: TCustomSelectDropdownData[] = subjects.map((subject) => ({value: subject.id.toString(), title: subject.name}));

    return (
        <div>
            <CustomBreadcrumb subLink={LinkDetails.myStudents} />
            <div className="my-5 flex items-center justify-between">
                <h1 className="text-3xl font-bold ">My Students</h1>
            </div>
            <div>
                <MyStudentTable subjects={selectedSubjects}/>
            </div>
        </div>
    )
}