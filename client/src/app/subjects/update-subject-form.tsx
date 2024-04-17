"use client";
import React, { useEffect, useState } from 'react'

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
import { Pencil1Icon, Pencil2Icon, PlusIcon } from "@radix-ui/react-icons"
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
import { createSubject, TSubject, updateSubject } from './action';
import { useToast } from '@/components/ui/use-toast';
import { signOut } from 'next-auth/react';
import { DropdownMenuItem, DropdownMenuShortcut } from '@/components/ui/dropdown-menu';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
    id: z.number({
        required_error: "Subject id is required.",
    }),
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

type TUpdateSubjectFormDialogProps = {
    subject: TSubject
}

const UpdateSubjectFormDialog: React.FC<TUpdateSubjectFormDialogProps> = ({ subject }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { toast } = useToast();
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        values: {
            id: subject.id,
            name: subject.name,
            code: subject.code,
            description: subject.description,
            day: subject.day,
            startTime: subject.startTime,
            endTime: subject.endTime
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            setIsLoading(true);
            const response = await updateSubject(values);

            if (response.error) {

                if (response.error === "Unauthenticated") {
                    signOut();
                    return;
                }

                for (const error of response.details) {
                    toast({
                        variant: "destructive",
                        title: "Update Subject Failed",
                        description: error.message,
                    })
                }

                return;
            }

            toast({
                variant: "default",
                title: "Subject Updated!",
                description: "Subject updated successfully!",
            })

            router.refresh();
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button size="sm" variant="outline">
                    <Pencil2Icon />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Update Subject Form</AlertDialogTitle>
                            <AlertDialogDescription>
                                Update the selected subject.
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
                            <Button disabled={isLoading} type="submit">Update</Button>
                        </AlertDialogFooter>
                    </form>
                </Form>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default UpdateSubjectFormDialog