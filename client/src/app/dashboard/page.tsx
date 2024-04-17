
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import Image from "next/image";
import { BarChartHero } from "./bar-chart";
import { getSession } from "@/lib/auth";

export default async function Dashboard() {

    return (
        <main className="">
            {/* PAGE TITLE */}
            <h1 className="text-3xl font-bold my-5">Dashboard</h1>
            {/* Cards */}
            <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                    <Card className="w-[340px] relative">
                        <Image src="/quiz.svg" alt={"quiz icon"} width={100} height={100} className="absolute bottom-1 right-1 opacity-[0.5]" />
                        <CardHeader className="pb-0">
                            <CardTitle className="text-lg m-0">Total Quizzes</CardTitle>
                            <CardDescription className="m-0">From IS-201, IT-301</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <h1 className="text-4xl font-extrabold">10</h1>
                        </CardContent>
                    </Card>
                    <Card className="w-[340px] relative">
                        <Image src="/calendar.svg" alt={"quiz icon"} width={100} height={100} className="absolute bottom-1 right-1 opacity-[0.5]" />
                        <CardHeader className="pb-0">
                            <CardTitle className="text-lg m-0">Total Attendance</CardTitle>
                            <CardDescription className="m-0">From IS-201, IT-301</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <h1 className="text-4xl font-extrabold">10</h1>
                        </CardContent>
                    </Card>
                </div>
                <div className="grid grid-cols-4 gap-2">
                    <Card className="col-span-3">
                        <CardHeader className="pb-0 ">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-lg m-0">Attendance Overview</CardTitle>
                                    <CardDescription className="m-0">From IS-201, IT-301</CardDescription>
                                </div>
                                <div>
                                    <Select>
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Select a fruit" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Fruits</SelectLabel>
                                                <SelectItem value="apple">Apple</SelectItem>
                                                <SelectItem value="banana">Banana</SelectItem>
                                                <SelectItem value="blueberry">Blueberry</SelectItem>
                                                <SelectItem value="grapes">Grapes</SelectItem>
                                                <SelectItem value="pineapple">Pineapple</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent >
                            <BarChartHero />
                        </CardContent>
                    </Card>
                    <Card className="">
                        <CardHeader>
                            <CardTitle className="text-lg m-0">Recent Attendance</CardTitle>
                            <CardDescription className="mt-0">From IS-201, IT-301</CardDescription>
                        </CardHeader>
                        <CardContent className="overflow-y-auto flex flex-col gap-4 h-[500px]">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="">IS - 201</h1>
                                    <p className="text-sm text-muted-foreground">April 1, 2023 10:30 AM </p>
                                </div>
                                <p className="text-red-500 ">Absent</p>
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="">IS - 201</h1>
                                    <p className="text-sm text-muted-foreground">April 1, 2023 10:30 AM </p>
                                </div>
                                <p className="text-red-500 ">Absent</p>
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="">IS - 201</h1>
                                    <p className="text-sm text-muted-foreground">April 1, 2023 10:30 AM </p>
                                </div>
                                <p className="text-red-500 ">Absent</p>
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="">IS - 201</h1>
                                    <p className="text-sm text-muted-foreground">April 1, 2023 10:30 AM </p>
                                </div>
                                <p className="text-red-500 ">Absent</p>
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="">IS - 201</h1>
                                    <p className="text-sm text-muted-foreground">April 1, 2023 10:30 AM </p>
                                </div>
                                <p className="text-red-500 ">Absent</p>
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="">IS - 201</h1>
                                    <p className="text-sm text-muted-foreground">April 1, 2023 10:30 AM </p>
                                </div>
                                <p className="text-red-500 ">Absent</p>
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="">IS - 201</h1>
                                    <p className="text-sm text-muted-foreground">April 1, 2023 10:30 AM </p>
                                </div>
                                <p className="text-red-500 ">Absent</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </main>
    );
}
