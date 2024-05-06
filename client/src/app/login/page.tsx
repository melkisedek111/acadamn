"use server"
import { redirect, RedirectType, useRouter, useSearchParams } from "next/navigation";
import LoginForm from "./login-form";
import { getSession } from "@/lib/auth";
import { Metadata, ResolvingMetadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: "Login Account",
        description: "Use your credentials to login.",
    }
}

export default async function Login(props: any) {
    const session = await getSession();

    if (session) {
        redirect("/dashboard", RedirectType.push);
    }

    return (
        <div className="h-screen flex items-center justify-center">
            <LoginForm />
        </div>
    )
}


