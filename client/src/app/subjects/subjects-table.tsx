import React from 'react'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import useGetSubjects from '@/hooks/useGetSubjects';
import UpdateSubjectFormDialog from './update-subject-form';
import { SetSubjectStatusDialog } from './set-subject-status';
import { getSubjects } from './action';
import { CircleDot } from "lucide-react";


const SubjectsTable = async () => {
    const subjects = await getSubjects();
    
    return (
        <Table>
            <TableCaption>A list of subjects.</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px]">ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Day</TableHead>
                    <TableHead>Start Time</TableHead>
                    <TableHead>End Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>

                {subjects.map((subject) => (
                    <TableRow key={subject.id}>
                        <TableCell className="font-medium">{subject.id}</TableCell>
                        <TableCell>{subject.name}</TableCell>
                        <TableCell>{subject.code}</TableCell>
                        <TableCell>{subject.description}</TableCell>
                        <TableCell>{subject.day.join(", ")}</TableCell>
                        <TableCell className="text-nowrap">{subject.startTime}</TableCell>
                        <TableCell className="text-nowrap">{subject.endTime}</TableCell>
                        <TableCell className={`text-nowrap ${subject.isActive ? "text-green-500" : "text-red-500"}`}>
                            <div className="flex gap-2 items-center">
                                <CircleDot /> {subject.isActive ? "Active" : "Inactive"}
                            </div>
                        </TableCell>
                        <TableCell className="">
                            <div className="flex gap-2 items-center">
                                <UpdateSubjectFormDialog subject={subject} />
                                <SetSubjectStatusDialog subjectId={subject.id} isActive={subject.isActive} />
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

export default SubjectsTable