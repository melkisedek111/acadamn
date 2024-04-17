import { getSubjects, TSubject } from '@/app/subjects/action';
import { signOut } from 'next-auth/react';
import React, { useEffect, useState } from 'react'

const useGetSubjects = () => {
    const [subjects, setSubjects] = useState<TSubject[]>([]);

    useEffect(() => {
        const getAllSubjects = async () => {
            const response = await getSubjects();

            // if (response?.error === "Unauthenticated") {
            //     signOut();
            //     return;
            // }

            setSubjects(response);
        }

        getAllSubjects();
    }, [])

    return { subjects }
}

export default useGetSubjects