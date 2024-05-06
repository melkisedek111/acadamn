import { getSubjects, TSubject } from '@/app/subjects/action';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const useGetSubjects = () => {
    const router = useRouter();
    const [subjects, setSubjects] = useState<TSubject[]>([]);

    useEffect(() => {
        const getAllSubjects = async () => {
            const response = await getSubjects() || [];
            const fetchedSubjects = response || [];
            setSubjects(fetchedSubjects);
        }

        getAllSubjects();
    }, [])

    return { subjects }
}

export default useGetSubjects