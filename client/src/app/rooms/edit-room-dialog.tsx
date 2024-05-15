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

import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { createRoom, updateRoom } from "./action";
import useErrorHandler from "@/hooks/useErrorHandler";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

const formSchema = z.object({
    name: z.string().min(1, {
        message: "Room name is required.",
    }),

});

type TEditRoomDialogProps = {
    room: {
        id: number;
        name: string;
    }
}

export function EditRoomDialog({ room }: TEditRoomDialogProps) {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);
    const { handleNoError } = useErrorHandler();
    const { toast } = useToast();

    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: room.name
        }
    });

    const hasChanges = form.getValues().name === room.name;

    const handleOpen = () => setOpen(!open);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            setIsLoading(true);
            const updatedRoom = await updateRoom({...values, id: room.id});
            const hasNoError = handleNoError(updatedRoom, "Room");

            if (hasNoError) {
                form.reset({
                    name: ""
                });
                toast({
                    variant: "default",
                    description: "Room has been updated successfully!",
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
        }} open={open}>
            <AlertDialogTrigger asChild>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button onClick={handleOpen} size="sm">
                                <Pencil2Icon />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Edit Room</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="">
                        <AlertDialogHeader>
                            <AlertDialogTitle>Update Room Form</AlertDialogTitle>
                            <AlertDialogDescription>
                                Update the selected room.
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
                            <AlertDialogCancel onClick={handleOpen} disabled={isLoading}>Cancel</AlertDialogCancel>
                            <Button type="submit" disabled={isLoading || hasChanges}>Update</Button>
                        </AlertDialogFooter>
                    </form>
                </Form>
            </AlertDialogContent>
        </AlertDialog>
    )
}
