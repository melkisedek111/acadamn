"use client"
import Image from "next/image";
import Link from "next/link";

import UseUserSession from "@/hooks/useUserSession";
import { getSession } from "@/lib/auth";
import NavLinks from "@/components/nav-link-dropdown";

export function Header() {
    const { isLoggedIn, user } = UseUserSession();

    // const session = await getSession();
    // const isLoggedIn = !!session;

    return (
        <div className="border-b border-gray-300">
            <header className="w-full flex items-center justify-between p-0 py-2 container">
                <div className="flex items-center gap-12">
                    <Image src="/acadamn-logo.svg" alt="acadamn logo" width={150} height={150} />
                    <nav className="flex items-center gap-5">
                        {
                            isLoggedIn && <>
                                <Link href="/dashboard">
                                    Dashboard
                                </Link>
                                <Link href="/exams">
                                    Exams
                                </Link>
                                <Link href="/subjects">
                                    Subjects
                                </Link>
                            </>
                        }
                    </nav>
                </div>
                <div className="flex items-center gap-5">
                    {
                        !isLoggedIn ?
                            <>
                                <Link href="/login">
                                    Login
                                </Link>
                                <Link href="/create-account">
                                    Create Account
                                </Link>
                            </>
                            : <NavLinks />
                    }

                </div>
                {/* PROFILE LOGO HERE */}
            </header>
        </div>
    )
}

export default Header;