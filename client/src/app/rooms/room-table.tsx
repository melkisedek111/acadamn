"use client"
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
import { TGetRoomsAndSubjectCounts } from './action';
import { EditRoomDialog } from './edit-room-dialog';
import SubjectRoomAssignmentDialog from './subject-room-assign-dialog';
import { Separator } from '@/components/ui/separator';
import { convertTo12hourFormat } from '@/helpers/global.helper';
import { Pencil2Icon } from '@radix-ui/react-icons';
import EditSubjectRoomAssignmentDialog from './edit-subject-room-assign-dialog';

export type TRoomTableProps = {
    rooms: TGetRoomsAndSubjectCounts[]
}

const RoomTable = ({ rooms }: TRoomTableProps) => {
    return (
        <Table>
            <TableCaption>A list of rooms and assigned subjects.</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead >ID</TableHead>
                    <TableHead>Room</TableHead>
                    <TableHead>
                        Assigned Subjects
                    </TableHead>
                    <TableHead>No. of Assigned Subjects</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {rooms.map((room) => (
                    <TableRow key={room.id}>
                        <TableCell className="font-medium">{room.id}</TableCell>
                        <TableCell>{room.name}</TableCell>
                        <TableCell>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="text-sm text-center">Subject</TableHead>
                                        <TableHead className="text-sm text-center">Days</TableHead>
                                        <TableHead className="text-sm text-center">Time</TableHead>
                                        <TableHead className="text-sm text-center">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                {room.subjectRoomAssignment.map(item => (
                                    <TableRow key={item.subject + item.startTime + item.endTime}>
                                        <TableCell className="text-sm text-center">{item.subject.name}</TableCell>
                                        <TableCell className="text-sm text-center">{item.day.map(d => d.toUpperCase()).join(", ")}</TableCell>
                                        <TableCell className="text-sm text-center">{convertTo12hourFormat(item.startTime)} - {convertTo12hourFormat(item.endTime)}</TableCell>
                                        <TableCell className="text-sm text-center">
                                            <EditSubjectRoomAssignmentDialog
                                                subjectRoomId={item.id}
                                                roomId={room.id}
                                                subjectId={item.subject.id}
                                                subjectName={item.subject.name}
                                                day={item.day}
                                                startTime={item.startTime}
                                                endTime={item.endTime}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </Table>
                        </TableCell>
                        <TableCell>{room._count.subjectRoomAssignment}</TableCell>
                        <TableCell className="justify-end flex gap-2 items-center">
                            <SubjectRoomAssignmentDialog roomId={room.id} roomName={room.name} />
                            <EditRoomDialog room={room} />
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

export default RoomTable