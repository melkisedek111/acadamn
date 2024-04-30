import { getSubjects, TSubject } from '@/app/subjects/action';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const useGetSubjects = () => {
    const router = useRouter();
    const [subjects, setSubjects] = useState<TSubject[]>([]);

    useEffect(() => {
        const getAllSubjects = async () => {
            const response = await getSubjects();

            if (response?.error === "Unauthenticated" || response?.error === "Unauthorized") {
                signOut();
                router.push("/login");
                return;
            }

            setSubjects(response);
        }

        getAllSubjects();
    }, [])

    return { subjects }
}

export default useGetSubjects