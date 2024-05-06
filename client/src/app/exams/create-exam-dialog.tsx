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
import { PlusIcon } from "@radix-ui/react-icons"
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
import { createExam } from "./action";
import { signOut } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";
import useGetSubjects from "@/hooks/useGetSubjects";

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


export function CreateExamDialog() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [listSubjects, setListSubjects] = useState<TSubjectSelect[]>([]);
    const { subjects } = useGetSubjects();
    const { toast } = useToast();

    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: undefined,
            description: undefined,
            subject: undefined,
            type: undefined,
            scheduleDate: new Date(),
            startTime: undefined,
            endTime: undefined
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            setIsLoading(true);

            const { subject, ...otherValues } = values;
            const response = await createExam({ subjectId: Number(subject), ...otherValues });

            if ("error" in response) {

                if (response.error === "Unauthenticated") {
                    signOut({
                        redirect: false,
                        callbackUrl: "/login"
                    });
                    return;
                }

                for (const error of response?.details) {
                    toast({
                        variant: "destructive",
                        title: "Create Exam Failed",
                        description: error.message,
                    })
                }

                return;
            }

            form.reset({
                title: "",
                description: "",
                subject: "",
                type: "",
                scheduleDate: new Date(),
                startTime: "",
                endTime: ""
            });
            toast({
                variant: "default",
                title: "Exam Created!",
                description: "Exam created successfully!",
            })
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        const subjectArr = [];

        for(const subject of subjects) {
            subjectArr.push({
                value: subject.id.toString(),
                label: subject.name
            })
        }

        setListSubjects(subjectArr);
    }, [subjects])

    return (
        <AlertDialog onOpenChange={() => {
            form.reset();
        }}>
            <AlertDialogTrigger asChild>
                <Button>
                    <PlusIcon className="mr-2" />
                    Create Exam
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="">
                        <AlertDialogHeader>
                            <AlertDialogTitle>Create Exam Form</AlertDialogTitle>
                            <AlertDialogDescription>
                                Create a new set of exam and its description.
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
                                            <Input placeholder="IS - 201 Basic Fundamentals of programming exam" {...field} />
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
                                            <Textarea placeholder="Topics cover for the quiz are C++, looping etc." {...field} />
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
                                        <Select onValueChange={field.onChange} value={field.value}>
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
                                        <Select onValueChange={field.onChange} value={field.value}>
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
                                            <Input type="time" {...field} />
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
                                            <Input type="time" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <AlertDialogFooter className="mt-5">
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <Button type="submit">Submit</Button>
                        </AlertDialogFooter>
                    </form>
                </Form>
            </AlertDialogContent>
        </AlertDialog>
    )
}
