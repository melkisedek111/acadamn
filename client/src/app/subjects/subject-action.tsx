"use client"
import React from 'react'
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Pencil1Icon, TrashIcon } from '@radix-ui/react-icons'
import { TSubject } from './action'
import UpdateSubjectFormDialog from './update-subject-form'

type TSubjectActionProps = {
    subject: TSubject;
}

const SubjectAction: React.FC<TSubjectActionProps> = ({ subject }) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">Action</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Action</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <UpdateSubjectFormDialog subject={subject} />
                    <DropdownMenuItem className='text-red-500'>
                        Delete
                        <DropdownMenuShortcut><TrashIcon /></DropdownMenuShortcut>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}


export default SubjectAction