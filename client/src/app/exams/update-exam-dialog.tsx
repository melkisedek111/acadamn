"use client";

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
import { Pencil2Icon, PlusIcon } from "@radix-ui/react-icons"
import { CalendarIcon } from "@radix-ui/react-icons"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { Textarea } from "@/components/ui/textarea"
import { useEffect, useState } from "react";
import { createExam, updateExam } from "./action";
import { signOut } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";
import useGetSubjects from "@/hooks/useGetSubjects";
import { TExamCardDetailsProps } from "./exam-card";
import useErrorHandler from "@/hooks/useErrorHandler";

const formSchema = z.object({
    title: z.string().min(1, {
        message: "Exam title is required.",
    }),
    description: z.string().min(1, {
        message: "Exam description is required.",
    }),
    subject: z.string().min(1, {
        message: "Please select a subject.",
    }),
    scheduleDate: z.date({
        required_error: "A date of exam is required.",
    }),
    type: z.string().min(1, {
        message: "Exam type is required.",
    }),
    startTime: z.string().min(1, {
        message: "Exam start time is required.",
    }),
    endTime: z.string().min(1, {
        message: "Exam end time is required.",
    }),
});

type TSubjectSelect = {
    value: string;
    label: string;
}


export function UpdateExamDialog({ exam }: { exam: TExamCardDetailsProps }) {
    const [open, setOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [listSubjects, setListSubjects] = useState<TSubjectSelect[]>([]);
    const { subjects } = useGetSubjects();
    const { toast } = useToast();
    const { handleNoError } = useErrorHandler();
    const originalValues = {
        title: exam.title,
        description: exam.description,
        subject: exam.subjectId.toString(),
        type: exam.type,
        scheduleDate: new Date(exam.scheduleDate),
        startTime: exam.startTime,
        endTime: exam.endTime
    }
    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: exam.title,
            description: exam.description,
            subject: exam.subjectId.toString(),
            type: exam.type,
            scheduleDate: new Date(exam.scheduleDate),
            startTime: exam.startTime,
            endTime: exam.endTime
        },
    })

    const hasChanges = JSON.stringify(originalValues) === JSON.stringify(form.getValues());
    const handleOpen = () => setOpen(!open);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            setIsLoading(true);
            const { subject, ...otherValues } = values;
            const response = await updateExam({id: exam.id, subjectId: Number(subject), ...otherValues });

            const hasNoError = handleNoError(response, "Update Exam");

            if (hasNoError) {
                toast({
                    variant: "default",
                    title: "Exam Updated!",
                    description: "Exam updated successfully!",
                });
                setOpen(false);
            }


        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        const subjectArr = [];

        for (const subject of subjects) {
            subjectArr.push({
                value: subject.id.toString(),
                label: subject.name
            })
        }

        setListSubjects(subjectArr);
    }, [subjects])

    return (
        <AlertDialog open={open} onOpenChange={() => {
            form.reset();
        }}>
            <AlertDialogTrigger asChild>
                <Pencil2Icon className="cursor-pointer" onClick={handleOpen} />
            </AlertDialogTrigger>
            <AlertDialogContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="">
                        <AlertDialogHeader>
                            <AlertDialogTitle>Update Exam Form</AlertDialogTitle>
                            <AlertDialogDescription>
                                Update a existed set of exam and its description.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <div className="grid grid-cols-1 gap-2 mt-5">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Title</FormLabel>
                                        <FormControl>
                                            <Input placeholder="IS - 201 Basic Fundamentals of programming exam" {...field} disabled={isLoading} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Topics cover for the quiz are C++, looping etc." {...field} disabled={isLoading} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="subject"
                                render={({ field }) => (
                                    <FormItem >
                                        <FormLabel>Subject</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value} disabled={isLoading}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select the subject of the quiz." />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {
                                                    listSubjects.map((item) => (
                                                        <SelectItem key={item.label} value={item.value}>{item.label}</SelectItem>
                                                    ))
                                                }
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem >
                                        <FormLabel>Type</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value} disabled={isLoading}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select the type of the exam." />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="quiz">Quiz</SelectItem>
                                                <SelectItem value="midterm">Midterm</SelectItem>
                                                <SelectItem value="final">Final</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="scheduleDate"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Scheduled Date</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            " pl-3 text-left font-normal",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                        disabled={isLoading}
                                                    >
                                                        {field.value ? (
                                                            format(field.value, "MMMM dd, yyyy")
                                                        ) : (
                                                            <span>Pick a date</span>
                                                        )}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    disabled={(date) =>
                                                        date < new Date()
                                                    }
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="startTime"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Start Time</FormLabel>
                                        <FormControl>
                                            <Input type="time" {...field} disabled={isLoading} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="endTime"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>End Time</FormLabel>
                                        <FormControl>
                                            <Input type="time" {...field} disabled={isLoading} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <AlertDialogFooter className="mt-5">
                            <AlertDialogCancel onClick={handleOpen} disabled={isLoading}>Cancel</AlertDialogCancel>
                            <Button type="submit" disabled={isLoading || hasChanges}>Update</Button>
                        </AlertDialogFooter>
                    </form>
                </Form>
            </AlertDialogContent>
        </AlertDialog>
    )
}
