"use client";

import React, { useState } from 'react'
import CheckStudentForm from './check-student-form'
import CreateAccountForm from './create-account-form';
import { useRouter } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { useSession } from 'next-auth/react';

export type TStudentIdentification = {
    studentId: string;
    id: number;
}

const page = () => {
    const session = useSession();
    const router = useRouter();
    const [studentIdentification, setStudentIdentificationId] = useState<TStudentIdentification | undefined>(undefined);

    if (session.data) {
        router.push("/dashboard");
    }

    return (
        <main className="h-screen">
            {/* PAGE TITLE */}
            <h1 className="text-3xl font-bold my-5 text-center">Create Account</h1>
            <div className="">
                {
                    studentIdentification ? <CreateAccountForm setStudentIdentificationId={setStudentIdentificationId} studentId={studentIdentification.studentId} id={studentIdentification.id} /> : <CheckStudentForm setStudentIdentificationId={setStudentIdentificationId}/>
                }
            </div>
        </main>
    )
}

export default page