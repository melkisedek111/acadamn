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
import { OpenInNewWindowIcon, PlusIcon } from "@radix-ui/react-icons"
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
import { useToast } from '@/components/ui/use-toast';
import { signOut } from 'next-auth/react';
import { getSubjects } from '../subjects/action';
import { UserCheck } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import useErrorHandler from '@/hooks/useErrorHandler';
import { CustomCombobox, TCustomComboboxData } from '@/components/customs/custom-combobox';
import { Label } from '@/components/ui/label';
import { assignSubjectToRoomCommand } from './action';

const formSchema = z.object({
    subject: z.string({
        required_error: "Subject is required.",
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

type TSubjectRoomAssignmentDialogProps = {
    roomId: number;
    roomName: string;
}

const SubjectRoomAssignmentDialog = ({ roomId, roomName }: TSubjectRoomAssignmentDialogProps) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);
    const [subjects, setSubjects] = useState<TCustomComboboxData[]>([]);
    const { toast } = useToast();
    const { handleNoError } = useErrorHandler()

    const handleDialogOpen = async () => {
        const subjects = await getSubjects();
        const hasNoError = handleNoError(subjects, "Fetching Subjects");

        if (hasNoError) {
            const modifiedSubjects: TCustomComboboxData[] = subjects.map(subject => ({ value: subject.name, label: subject.name, id: subject.id }));
            setSubjects(modifiedSubjects)
            setOpen(true);
        }
    }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            subject: undefined,
            day: [],
            startTime: undefined,
            endTime: undefined
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            setIsLoading(true);
            const subjectId = subjects.find(subject => subject.value === values.subject)?.id;
            const { subject, ...otherValues } = values;

            if (subjectId) {
                const room = await assignSubjectToRoomCommand({ ...otherValues, subjectId: subjectId, roomId: roomId });
                const hasNoError = handleNoError(room, "Assigning Subject");

                if (hasNoError) {
                    form.reset({
                        subject: undefined,
                        day: [],
                        startTime: undefined,
                        endTime: undefined
                    })
                    setOpen(false);
                    toast({
                        variant: "default",
                        title: "Subject Created!",
                        description: "Subject created successfully!",
                    })
                }
            }

        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }

    const handleGetUnassignedSubjects = () => {

    }

    return (
        <AlertDialog open={open}>
            <AlertDialogTrigger asChild>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button onClick={handleDialogOpen} size="sm" className="bg-orange-500">
                                <OpenInNewWindowIcon />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Assign Subject Room</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="">
                        <AlertDialogHeader>
                            <AlertDialogTitle>Subject Room Assignment Form.</AlertDialogTitle>
                            <AlertDialogDescription>
                                Assign subjects to the selected room.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <div className="grid grid-cols-1 gap-2 mt-5">
                            <div>
                                <Label>Selected Room</Label>
                                <Input value={roomName} disabled={true} />
                            </div>
                            <FormField
                                control={form.control}
                                name="subject"
                                render={({ field }) => {
                                    return (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Subjects</FormLabel>
                                            <FormControl>
                                                <CustomCombobox
                                                    data={subjects}
                                                    placeholder="Please select subject"
                                                    title="Subjects"
                                                    selectedData={field.value}
                                                    name={field.name}
                                                    form={form} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )
                                }}
                            />
                            <FormField
                                control={form.control}
                                name="day"
                                render={() => (
                                    <FormItem>
                                        <div className="mb-4">
                                            <FormLabel>Day</FormLabel>
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
                            <AlertDialogCancel onClick={() => {
                                form.reset({
                                    subject: undefined,
                                    day: [],
                                    startTime: undefined,
                                    endTime: undefined
                                })
                                setOpen(false)
                            }}>Cancel</AlertDialogCancel>
                            <Button disabled={isLoading} type="submit">Submit</Button>
                        </AlertDialogFooter>
                    </form>
                </Form>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default SubjectRoomAssignmentDialog