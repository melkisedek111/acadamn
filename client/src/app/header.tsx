"use client"
import { ModeToggle } from "@/components/mode-toggle";
import Image from "next/image";
import Link from "next/link";

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { signOut } from "next-auth/react";
import UseUserSession from "@/hooks/useUserSession";
import { getSession } from "@/lib/auth";
import NavLinks from "@/components/nav-links";

export function Header() {
    const { isLoggedIn, user } = UseUserSession();

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
                                <Link href="/quizzes">
                                    Quizzes
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