"use client";
import React from 'react'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from './ui/breadcrumb'
import Link from 'next/link'

type TBreadcrumbLinks = {
    title: string;
    link: string;
}

export type TCustomBreadcrumbProps = {
    subLink?: TBreadcrumbLinks;
    currentTitle?: string;
}

const CustomBreadcrumb = ({ subLink, currentTitle }: TCustomBreadcrumbProps) => {

    return (
        <Breadcrumb className="hidden md:flex">
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                        <Link href="/dashboard">Dashboard</Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>
                {
                    subLink && !currentTitle ? <>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>{subLink.title}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </> : null
                }
                {
                    subLink && currentTitle ? <>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Link href={subLink?.link || ""}>{subLink?.title}</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                    </> : null
                }
                {
                    currentTitle ? <>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>{currentTitle}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </> : null
                }
            </BreadcrumbList>
        </Breadcrumb>
    )
}

export default CustomBreadcrumb