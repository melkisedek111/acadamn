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
import { signOut } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";
import useGetSubjects from "@/hooks/useGetSubjects";
import { createRoom } from "./action";
import useErrorHandler from "@/hooks/useErrorHandler";

const formSchema = z.object({
    name: z.string().min(1, {
        message: "Room name is required.",
    }),
   
});


export function AddRoomDialog() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { handleNoError } = useErrorHandler();
    const { toast } = useToast();

    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            setIsLoading(true);
            const room = await createRoom(values);
            const hasNoError = handleNoError(room, "Room");

            if(hasNoError) {
                form.reset({
                    name: ""
                });
                toast({
                    variant: "default",
                    description: "Room has been created successfully!",
                })
            }

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
                    Create Room
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="">
                        <AlertDialogHeader>
                            <AlertDialogTitle>Create Room Form</AlertDialogTitle>
                            <AlertDialogDescription>
                                Create a new room.
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
                                            <Input placeholder="IT Room - 101" {...field} disabled={isLoading} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <AlertDialogFooter className="mt-5">
                            <AlertDialogCancel  disabled={isLoading}>Cancel</AlertDialogCancel>
                            <Button type="submit" disabled={isLoading}>Submit</Button>
                        </AlertDialogFooter>
                    </form>
                </Form>
            </AlertDialogContent>
        </AlertDialog>
    )
}
