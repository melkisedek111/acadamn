"use client";

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusIcon } from "@radix-ui/react-icons"
import Link from "next/link"
import { CreateQuizzesDialog } from "./create-quizzes-dialog";
import { useParams } from "next/navigation";
import Authorized from "@/hoc/authorized";
import { ROLES_OBJ } from "../../constants/app.constants";

const ExamCardDetails = () => {

    return (
        <Card className="w-[450px]">
            <CardHeader className="relative pb-0">
                <CardTitle className="text-xl m-0">IS - 201</CardTitle>
                <CardDescription className="m-0">Introduction to Computer</CardDescription>
                <small>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ex sit ipsam pariatur laboriosam facilis. Cupiditate eos commodi nesciunt natus, culpa modi. Nam dolor eos, obcaecati neque harum sapiente perferendis consequuntur?</small>
                <p className="p-2 text-center absolute right-0 border-blue-500 border-t border-l border-b rounded-l-xl w-[150px]">Active</p>
            </CardHeader>
            <hr className="my-4" />
            <CardContent>
                <div className="flex items-center justify-between">
                    <p className="text-muted-foreground">No of Items:</p>
                    <p className="font-semibold">40</p>
                </div>
                <div className="flex items-center justify-between">
                    <p className="text-muted-foreground">Schedule Date:</p>
                    <p className="font-semibold">April 1, 2024</p>
                </div>
                <div className="flex items-center justify-between">
                    <p className="text-muted-foreground">Schedule Time:</p>
                    <p className="font-semibold">10:00 AM - 11:30 AM</p>
                </div>
                <div className="flex items-center justify-between">
                    <p className="text-muted-foreground">Duration:</p>
                    <p className="font-semibold">90 Minutes</p>
                </div>
                <div className="flex items-center justify-between">
                    <p className="text-muted-foreground">Student Completed:</p>
                    <p className="font-semibold">23</p>
                </div>
            </CardContent>
            <CardFooter className="flex justify-between">
                <Button size={"sm"} asChild>
                    <Link href={"add-quiz-item/1"}>
                        <PlusIcon className="mr-2" />
                        Add Item
                    </Link>
                </Button>
                <Button size={"sm"} variant={"destructive"}>
                    Set Inactive
                </Button>
            </CardFooter>
        </Card>
    )
}

const QuizzesPage = () => {

    return (
        <div>
            <div className="my-5 flex items-center justify-between">
                <h1 className="text-3xl font-bold ">Quizzes</h1>
                {/* <Button>
                    <PlusIcon className="mr-2"/>
                    <Link href={"/create-quizzes"}>
                        Create Quiz
                    </Link>
                </Button> */}
                <CreateQuizzesDialog />
            </div>
            <div className="flex flex-wrap gap-5">
                <ExamCardDetails />
                <ExamCardDetails />
                <ExamCardDetails />
                <ExamCardDetails />
                <ExamCardDetails />
                <ExamCardDetails />
                <ExamCardDetails />
                <ExamCardDetails />
                <ExamCardDetails />
            </div>
        </div>
    )
}

export default Authorized([ROLES_OBJ.ADMIN])(QuizzesPage)