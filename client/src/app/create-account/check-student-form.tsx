"use client"
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import React, { useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { fetchApi } from '@/helpers/fetch'
import { useToast } from '@/components/ui/use-toast'
import { ToastAction } from '@/components/ui/toast'
import { checkStudentId } from './action'
import { TStudentIdentification } from './page'
import Link from 'next/link'

const formSchema = z.object({
    studentId: z.string({
        required_error: "Student ID is required."
    }).min(1, {
        message: "Student ID is required."
    }),
})

type TCheckStudentForm = {
    setStudentIdentificationId: React.Dispatch<React.SetStateAction<TStudentIdentification | undefined>>
}

const CheckStudentForm = ({ setStudentIdentificationId }: TCheckStudentForm) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { toast } = useToast();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            studentId: "",
        },
    })

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        try {
            setIsLoading(true);
            const response = await checkStudentId(values);

            if (response) {
                if ("error" in response) {
                    for (const error of response.details) {
                        toast({
                            variant: "destructive",
                            title: "Checking Student ID Failed!",
                            description: error.message,
                            action: <ToastAction altText="Try again">Try again</ToastAction>,
                        })
                    }
                    return;
                }

                setStudentIdentificationId(response);
            }
        } catch (error: any) {
            console.log(error);
            toast({
                variant: "destructive",
                title: "Internal Server Error",
                description: error?.message,
                action: <ToastAction altText="Try again">Try again</ToastAction>,
            })
        }
        finally {
            setIsLoading(false);
        }
    }

    return (
        <Card className="p-5 w-[500px] mx-auto my-auto">
            <h1 className="text-xl font-bold mb-5">Check your Student ID</h1>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 flex flex-col justify-center">
                    <FormField
                        control={form.control}
                        name="studentId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Student ID</FormLabel>
                                <FormControl>
                                    <Input placeholder="Please enter your Student ID." {...field} disabled={isLoading} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" disabled={isLoading}>Submit</Button>
                    <Link href="/login" className="hover:text-primary">
                        Have an account? Login Here.
                    </Link>
                </form>
            </Form>
        </Card>
    )
}

export default CheckStudentForm