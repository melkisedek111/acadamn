"use client"
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { redirect, usePathname, useRouter } from "next/navigation";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";
import Link from "next/link";

const formSchema = z.object({
    studentId: z.string({
        required_error: "Student ID is required."
    }).min(1, {
        message: "Student ID is required."
    }),
    password: z.string({
        required_error: "Password is required."
    }).min(1, {
        message: "Password is required."
    }),
})

const LoginForm = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const router = useRouter();
    const pathname = usePathname()
    const { toast } = useToast();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            studentId: "",
            password: ""
        },
    })

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        try {
            setIsLoading(true);
            if (!isLoading) {
                const data = await signIn("credentials", {
                    studentId: values.studentId,
                    password: values.password,
                    redirect: false
                });

                if (data?.error) {
                    const errors = JSON.parse(data.error);

                    for (const error of errors) {
                        toast({
                            variant: "destructive",
                            title: "Login Failed!",
                            description: error.message,
                            action: <ToastAction altText="Try again">Try again</ToastAction>,
                        })
                    }
                } else {
                    router.replace("dashboard");
                }
            }
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        console.log(pathname);
    }, [])

    return (
        <Card className="w-full max-w-md mx-auto">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col justify-center">
                    <CardHeader>
                        <CardTitle className="text-2xl">Login</CardTitle>
                        <CardDescription>
                            Enter your Student ID below to login to your account.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <div className="grid gap-2">
                            <FormField
                                control={form.control}
                                name="studentId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Student ID</FormLabel>
                                        <FormControl>
                                            <Input disabled={isLoading} placeholder="e.g. 2020-00001" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid gap-2">
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" disabled={isLoading} placeholder="Please enter your password." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-2">
                        <Button type="submit" className="w-full">Sign in</Button>
                        <Link href="/create-account" className="hover:text-primary">
                            Don't have an account?
                        </Link>
                    </CardFooter>
                </form>
            </Form>

        </Card>
    )
}


export default LoginForm;