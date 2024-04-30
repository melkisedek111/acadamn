"use client"
import Spinner from '@/components/spinner'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const Authorized = (authorizedRoles: string[]) => {
    return (Component: React.ComponentType<any>) => {
        const AuthorizedComponent : React.FC<any> = (props: any) => {
            const [isLoading, setIsLoading] = useState<boolean>(false);
            const router = useRouter();
            const session = useSession();

            useEffect(() => {
                try {
                    setIsLoading(true);
                    if (session?.data) {
                        if(session?.data.user) {
                            const role = session?.data.user.role;
    
                            if (!authorizedRoles.includes(role)) {
                                router.push("/dashboard")
                            }
                        }
                    }
                } finally {
                    setIsLoading(false);
                }
            }, [session])

            if(isLoading) {
                return <Spinner />
            }

            return <Component {...props} />;
        }

        return AuthorizedComponent
    }
}

export default Authorized;