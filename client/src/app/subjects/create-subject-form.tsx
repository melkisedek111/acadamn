"use client";
import React, { useState } from 'react'

import { Button } from "@/components/ui/button"
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { PlusIcon } from "@radix-ui/react-icons"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"

import { Textarea } from "@/components/ui/textarea"
import { DAYS } from '@/constants/app.constants';
import { createSubject } from './action';
import { useToast } from '@/components/ui/use-toast';
import { signOut } from 'next-auth/react';

const formSchema = z.object({
    name: z.string({
        required_error: "Subject name is required.",
    }).min(1, {
        message: "Subject name is required."
    }),
    code: z.string({
        required_error: "Subject code is required.",
    }).min(1, {
        message: "Subject code is required."
    }),
    description: z.string({
        required_error: "Subject description is required.",
    }).min(1, {
        message: "Subject description is required."
    }),
    day: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: "You have to select at least one day for the subject.",
    }),
    startTime: z.string({
        required_error: "Subject start time is required.",
    }).min(1, {
        message: "Subject start time is required."
    }),
    endTime: z.string({
        required_error: "Subject end time is required.",
    }).min(1, {
        message: "Subject end time is required."
    }),
}).superRefine((val, ctx) => {
    if (val.startTime >= val.endTime) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['endTime'],
            message: 'End time should be greater than the Start time.',
        })
    }
});

const CreateSubjectFormDialog = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { toast } = useToast();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: undefined,
            code: undefined,
            description: undefined,
            day: [],
            startTime: undefined,
            endTime: undefined
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            setIsLoading(true);
            const response = await createSubject(values);

            if (response.error) {

                if(response.error === "Unauthenticated") {
                    signOut();
                    return;
                }

                for (const error of response.details) {
                    toast({
                        variant: "destructive",
                        title: "Create Subject Failed",
                        description: error.message,
                    })
                }

                return;
            }

            form.reset({
                name: "",
                code: "",
                description: "",
                day: [],
                startTime: "",
                endTime: "",
            });
            toast({
                variant: "default",
                title: "Subject Created!",
                description: "Subject created successfully!",
            })
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <AlertDialog onOpenChange={() => {
            form.reset();
        }}>
            <AlertDialogTrigger asChild>
                <Button>
                    <PlusIcon className="mr-2" />
                    Create Subject
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="">
                        <AlertDialogHeader>
                            <AlertDialogTitle>Create Subject Form</AlertDialogTitle>
                            <AlertDialogDescription>
                                Create a new subject and its description.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <div className="grid grid-cols-1 gap-2 mt-5">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input disabled={isLoading} placeholder="Please enter the subject name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="code"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Code</FormLabel>
                                        <FormControl>
                                            <Input disabled={isLoading} placeholder="Please enter the subject code" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem >
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea rows={5} disabled={isLoading} placeholder="Please enter the subject description." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="day"
                                render={() => (
                                    <FormItem>
                                        <div className="mb-4">
                                            <FormLabel className="text-base">Day</FormLabel>
                                            <FormDescription>
                                                Select the day(s) for the subject.
                                            </FormDescription>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {DAYS.map((item) => (
                                                <FormField
                                                    key={item.id}
                                                    control={form.control}
                                                    name="day"
                                                    render={({ field }) => {
                                                        return (
                                                            <FormItem
                                                                key={item.id}
                                                                className="flex flex-row items-start space-x-3 space-y-0"
                                                            >
                                                                <FormControl>
                                                                    <Checkbox
                                                                        disabled={isLoading}
                                                                        checked={field.value?.includes(item.id)}
                                                                        onCheckedChange={(checked) => {
                                                                            return checked
                                                                                ? field.onChange([...field.value, item.id])
                                                                                : field.onChange(
                                                                                    field.value?.filter(
                                                                                        (value) => value !== item.id
                                                                                    )
                                                                                )
                                                                        }}
                                                                    />
                                                                </FormControl>
                                                                <FormLabel className="text-sm font-normal">
                                                                    {item.label}
                                                                </FormLabel>
                                                            </FormItem>
                                                        )
                                                    }}
                                                />
                                            ))}
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex justify-between gap-2 w-full">
                                <FormField
                                    control={form.control}
                                    name="startTime"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormLabel>Start Time</FormLabel>
                                            <FormControl className="w-full">
                                                <Input disabled={isLoading} type="time" placeholder="Search..." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="endTime"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormLabel>End Time</FormLabel>
                                            <FormControl className="w-full">
                                                <Input disabled={isLoading} type="time" placeholder="Search..." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                        <AlertDialogFooter className="mt-5">
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <Button disabled={isLoading} type="submit">Submit</Button>
                        </AlertDialogFooter>
                    </form>
                </Form>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default CreateSubjectFormDialog