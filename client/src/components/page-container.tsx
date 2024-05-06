"use client";
import { usePathname } from 'next/navigation'
import React, { ReactNode, useEffect, useState } from 'react'
import Navigation from './navigation';
import { useSession } from 'next-auth/react';

const PageContainer = ({ children }: { children: ReactNode }) => {
    const pathname = usePathname();
    const noNavLinks = ["/login", "/create-account"];
    const session = useSession();
    const [isSessionSet, setIsSessionSet] = useState<boolean>(false);

    useEffect(() => {
        if(session) {
            setIsSessionSet(true);
        }
    },[session])

    return (
        !noNavLinks.includes(pathname || "") && isSessionSet ?
            <Navigation>
                { children }
            </Navigation>
            : <div className="container mx-auto">
                {children}
            </div>
    )
}

export default PageContainer