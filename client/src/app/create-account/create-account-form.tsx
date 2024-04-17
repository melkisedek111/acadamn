"use client"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import { checkStudentId, createUserAccount, TCreateUserAccount } from './action'
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { CalendarIcon } from "@radix-ui/react-icons"
import { format } from "date-fns"
import { cn } from '@/lib/utils'
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import Link from 'next/link'
import { TStudentIdentification } from './page'

const formSchema = z.object({
    firstName: z
        .string({
            required_error: "First name is required.",
        })
        .min(2, { message: "Must be 2 or more characters long" })
        .trim(),
    middleName: z
        .string()
        .trim()
        .optional(),
    lastName: z
        .string({
            required_error: "Last name is required.",
        })
        .min(2, { message: "Must be 2 or more characters long" })
        .trim(),
    gender: z.enum(["male", "female"], {
        required_error: "You need to select a gender.",
    }),
    dateOfBirth: z.date({
        required_error: "Date of birth is required.",
    }),
    studentId: z.string({
        required_error: "Student ID is required.",
    }),
    barangay: z.string({
        required_error: "Barangay is required.",
    }),
    municipality: z.string({
        required_error: "Municipality is required.",
    }),
    province: z.string({
        required_error: "Province is required.",
    }),
    password: z
        .string({
            required_error: "Password is required.",
        })
        .min(8, { message: "Password must 8 or more characters long" })
        .trim(),
    confirmPassword: z
        .string({
            required_error: "Confirm Password is required.",
        })
        .trim(),
    email: z
        .string({
            required_error: "Email is required.",
        })
        .email({
            message: "Valid email is required.",
        })
        .trim(),
}).superRefine((val, ctx) => {
    if (val.password !== val.confirmPassword) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['confirmPassword'],
            message: 'Passwords do not match',
        })
    }
});



type TCreateAccountFormProps = TStudentIdentification & {
    setStudentIdentificationId: React.Dispatch<React.SetStateAction<TStudentIdentification | undefined>>
}

const CreateAccountForm = ({ studentId, id: studentIdentificationId, setStudentIdentificationId }: TCreateAccountFormProps) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { toast } = useToast();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: undefined,
            middleName: "",
            lastName: undefined,
            gender: "male",
            dateOfBirth: new Date(),
            province: undefined,
            barangay: undefined,
            municipality: undefined,
            password: undefined,
            email: undefined,
            studentId: studentId
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            setIsLoading(true);
            const params: TCreateUserAccount = {
                studentIdentificationId: studentIdentificationId,
                firstName: values.firstName,
                middleName: values.middleName,
                lastName: values.lastName,
                gender: values.gender,
                dateOfBirth: values.dateOfBirth.toISOString(),
                barangay: values.barangay,
                province: values.province,
                municipality: values.municipality,
                password: values.password,
                email: values.email,
            }

            const response = await createUserAccount(params);

            if (response.error) {
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

            setStudentIdentificationId(undefined);
            toast({
                variant: "default",
                title: "Account Created!",
                description: "Account created successfully!",
            })
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }

    const cancelCreateAccount = () => {
        setStudentIdentificationId(undefined);
    }

    return (
        <Card>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <CardHeader>
                        <CardTitle>Create Student Form</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-10">
                        <div className="grid grid-cols-3 gap-4">
                            <div className="col-span-2 flex flex-col gap-4">
                                <h3 className="text-md font-bold">Student Details</h3>
                                <div className="flex gap-4">
                                    <FormField
                                        control={form.control}
                                        name="studentId"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Student ID</FormLabel>
                                                <FormControl>
                                                    <Input disabled {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="flex gap-4">
                                    <FormField
                                        control={form.control}
                                        name="firstName"
                                        render={({ field }) => (
                                            <FormItem className="flex-1">
                                                <FormLabel>First Name</FormLabel>
                                                <FormControl>
                                                    <Input disabled={isLoading} placeholder="Please enter your first name." {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="middleName"
                                        render={({ field }) => (
                                            <FormItem className="flex-1">
                                                <FormLabel>Middle Name</FormLabel>
                                                <FormControl>
                                                    <Input disabled={isLoading} placeholder="Please enter your middle name." {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="lastName"
                                        render={({ field }) => (
                                            <FormItem className="flex-1">
                                                <FormLabel>Last Name</FormLabel>
                                                <FormControl>
                                                    <Input disabled={isLoading} placeholder="Please enter your last name." {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="flex gap-4">
                                    <FormField
                                        control={form.control}
                                        name="dateOfBirth"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col flex-[0.5]">
                                                <FormLabel>Date of birth</FormLabel>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button
                                                                variant={"outline"}
                                                                className={cn(
                                                                    "pl-3 text-left font-normal",
                                                                    !field.value && "text-muted-foreground"
                                                                )}
                                                                disabled={isLoading}
                                                            >
                                                                {field.value ? (
                                                                    format(field.value, "PPP")
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
                                                            captionLayout="dropdown-buttons"
                                                            disabled={(date) =>
                                                                date > new Date() || date < new Date("1900-01-01")
                                                            }
                                                            initialFocus
                                                            fromYear={1960}
                                                            toYear={2030}
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="gender"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Gender</FormLabel>
                                                <FormControl>
                                                    <RadioGroup
                                                        onValueChange={field.onChange}
                                                        defaultValue={field.value}
                                                        className="flex gap-4 "
                                                        disabled={isLoading}
                                                    >
                                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                                            <FormControl>
                                                                <RadioGroupItem value="male" />
                                                            </FormControl>
                                                            <FormLabel className="font-normal">
                                                                Male
                                                            </FormLabel>
                                                        </FormItem>
                                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                                            <FormControl>
                                                                <RadioGroupItem value="female" />
                                                            </FormControl>
                                                            <FormLabel className="font-normal">
                                                                Female
                                                            </FormLabel>
                                                        </FormItem>
                                                    </RadioGroup>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                </div>
                                <div className="flex gap-4">
                                    <FormField
                                        control={form.control}
                                        name="barangay"
                                        render={({ field }) => (
                                            <FormItem className="flex-1">
                                                <FormLabel>Barangay</FormLabel>
                                                <FormControl>
                                                    <Input disabled={isLoading} placeholder="Please enter your barangay." {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="municipality"
                                        render={({ field }) => (
                                            <FormItem className="flex-1">
                                                <FormLabel>Municipality</FormLabel>
                                                <FormControl>
                                                    <Input disabled={isLoading} placeholder="Please enter your municipality." {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="province"
                                        render={({ field }) => (
                                            <FormItem className="flex-1">
                                                <FormLabel>Province</FormLabel>
                                                <FormControl>
                                                    <Input disabled={isLoading} placeholder="Please enter your province." {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                            <div className="col-span-1 flex flex-col gap-4">
                                <h3 className="text-md font-bold">Account Details</h3>
                                <div className="flex flex-col gap-4">
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input disabled={isLoading} placeholder="Please enter your email." {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Password</FormLabel>
                                                <FormControl>
                                                    <Input disabled={isLoading} type="password" placeholder="Please enter your password" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="confirmPassword"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Confirm Password</FormLabel>
                                                <FormControl>
                                                    <Input disabled={isLoading} type="password" placeholder="Please enter your confirm password." {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-center gap-4">
                            <Button type="button" variant="outline" onClick={cancelCreateAccount}>
                                Cancel
                            </Button>
                            <Button type="submit">Submit</Button>
                        </div>
                    </CardContent>
                </form>
            </Form>
        </Card>
    )
}

export default CreateAccountForm