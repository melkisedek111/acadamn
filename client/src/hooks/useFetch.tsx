"use client"
import { signOut } from 'next-auth/react';
import React, { useEffect, useState } from 'react'

type TUseFetchProps = {
    getFunction: any,
    params: any;
}

const useFetch = ({ getFunction, params }: TUseFetchProps) => {
    const [response, setResponse] = useState<any>(undefined);

    useEffect(() => {
        console.log({params})
        const request = async () => {
            let res = undefined;
            console.log({getFunction})
            if(getFunction) {
                res = await getFunction(params);
                console.log({res})
                if (res.error === "Unauthenticated") {
                    signOut();
                    return;
                }

                setResponse(res);
            }
        }

        request();

    }, [getFunction]) 
    
    return { response }
}

export default useFetch