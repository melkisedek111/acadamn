import { Session } from 'next-auth';
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react'

const UseUserSession = () => {
    const session = useSession();
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [user, setUser] = useState<Session | null>(null);
    const router = useRouter();

    useEffect(() => {
        if(session.data) {
            setUser(session.data);
            setIsLoggedIn(true);
        }

        if (session.data === null) {
            setIsLoggedIn(false);
            router.push("/login")
        }
    },[session])

    return { isLoggedIn, user };
}

export default UseUserSession