"use client"

import { LinkTitle, TLinkDetails, TLinks } from '@/constants/app.constants';
import { BrickWall, CircleUser, Home, ListTodo, LucideIcon, NotepadText } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation'
import React from 'react'

const LinkDetails: TLinkDetails<{ Icon: LucideIcon }> = {
    [LinkTitle.DASHBOARD]: {
        title: "Dashboard",
        link: "/dashboard",
        Icon: Home
    },
    [LinkTitle.EXAMS]: {
        title: "Exams",
        link: "/exams",
        Icon: ListTodo
    },
    [LinkTitle.SUBJECTS]: {
        title: "Subjects",
        link: "/subjects",
        Icon: NotepadText
    },
    [LinkTitle.MYSTUDENTS]: {
        title: "My Students",
        link: "/my-students",
        Icon: CircleUser
    },
    [LinkTitle.ROOMS]: {
        title: "Rooms",
        link: "/rooms",
        Icon: BrickWall
    }
}

type TNavLinks = TLinks & { Icon: LucideIcon };

export const links: TNavLinks[] = [
    LinkDetails.dashboard,
    LinkDetails.exams,
    LinkDetails.subjects,
    LinkDetails.myStudents,
    LinkDetails.rooms
]

const NavigationLinks = ({ iconClassName, linkClassName, screen }: { iconClassName: string, linkClassName: string; screen: string; }) => {
    const pathname = usePathname();

    return (
        links.map(({ link, title, Icon }) => (
            <Link
                key={title + "-" + screen}
                href={link}
                className={`${pathname.includes(link) ? "text-primary" : ""} ${linkClassName}`}>
                <Icon className={iconClassName} />
                {title}
            </Link>
        ))
    )
}

export default NavigationLinks