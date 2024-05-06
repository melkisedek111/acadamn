"use client";

import React from 'react'
import { signOut } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from 'next/navigation';
import Spinner from '@/components/spinner';

const Logout = () => {
    const router = useRouter();

    useEffect(() => {
        signOut({ redirect: false }).then(() => {
            router.push("/login");
        });
    }, []);
    return (
        <div className="w-full flex items-center justify-center">
            <Spinner />
        </div>
    )
}

export default Logout