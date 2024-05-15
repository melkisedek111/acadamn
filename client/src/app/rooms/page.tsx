"use server";

import CustomBreadcrumb from '@/components/custom-breadcrumb'
import { LinkDetails } from '@/constants/app.constants'
import React, { Suspense } from 'react'
import { AddRoomDialog } from './add-room-dialog'
import { GetRoomsAndSubjectCountsQuery, TGetRoomsAndSubjectCounts } from './action';
import RoomTable from './room-table';
import { unstable_noStore } from 'next/cache';
import Spinner from '@/components/spinner';

const invoices = [
    {
        invoice: "INV001",
        paymentStatus: "Paid",
        totalAmount: "$250.00",
        paymentMethod: "Credit Card",
    },
    {
        invoice: "INV002",
        paymentStatus: "Pending",
        totalAmount: "$150.00",
        paymentMethod: "PayPal",
    },
    {
        invoice: "INV003",
        paymentStatus: "Unpaid",
        totalAmount: "$350.00",
        paymentMethod: "Bank Transfer",
    },
    {
        invoice: "INV004",
        paymentStatus: "Paid",
        totalAmount: "$450.00",
        paymentMethod: "Credit Card",
    },
    {
        invoice: "INV005",
        paymentStatus: "Paid",
        totalAmount: "$550.00",
        paymentMethod: "PayPal",
    },
    {
        invoice: "INV006",
        paymentStatus: "Pending",
        totalAmount: "$200.00",
        paymentMethod: "Bank Transfer",
    },
    {
        invoice: "INV007",
        paymentStatus: "Unpaid",
        totalAmount: "$300.00",
        paymentMethod: "Credit Card",
    },
]


export default async function page() {
    unstable_noStore();
    const rooms: TGetRoomsAndSubjectCounts[] = await GetRoomsAndSubjectCountsQuery({});

    return (
        <div>
            <CustomBreadcrumb subLink={LinkDetails.rooms} />
            <div className="my-5 flex items-center justify-between">
                <h1 className="text-3xl font-bold ">Rooms</h1>
                <AddRoomDialog />
            </div>
            <div>
                <RoomTable rooms={rooms} />
            </div>
        </div>
    )
}
