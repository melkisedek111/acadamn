"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusIcon } from "@radix-ui/react-icons"
import Link from "next/link"
import { CreateExamDialog } from "./create-exam-dialog";
import { useParams } from "next/navigation";
import Authorized from "@/hoc/authorized";
import { ROLES_OBJ } from "../../constants/app.constants";
import { TGetExams } from "./action"

export type TExamCardDetailsProps = TGetExams

const ExamCardDetails: React.FC<TExamCardDetailsProps> = ({ id, title, subject, type, isActive, description, scheduleDate, scheduleTime, noOfItems, studentCompleted, duration }) => {
    return (
        <Card className="w-[450px]">
            <CardHeader className="relative pb-0">
                <CardTitle className="text-xl m-0">{title}</CardTitle>
                <CardDescription className="m-0">{subject}</CardDescription>
                <small>{description}</small>
                <p className={`p-2 text-center absolute right-0 ${isActive ? "border-blue-500" : "border-red-500"} border-t border-l border-b rounded-l-xl w-[150px]`}>{isActive ? "Active" : "Inactive"}</p>
            </CardHeader>
            <hr className="my-4" />
            <CardContent>
                <div className="flex items-center justify-between">
                    <p className="text-muted-foreground">No of Items:</p>
                    <p className="font-semibold">{noOfItems}</p>
                </div>
                <div className="flex items-center justify-between">
                    <p className="text-muted-foreground">Schedule Date:</p>
                    <p className="font-semibold">{scheduleDate}</p>
                </div>
                <div className="flex items-center justify-between">
                    <p className="text-muted-foreground">Schedule Time:</p>
                    <p className="font-semibold">{scheduleTime}</p>
                </div>
                <div className="flex items-center justify-between">
                    <p className="text-muted-foreground">Duration:</p>
                    <p className="font-semibold">{duration} Minutes</p>
                </div>
                <div className="flex items-center justify-between">
                    <p className="text-muted-foreground">Student Completed:</p>
                    <p className="font-semibold">{studentCompleted}</p>
                </div>
            </CardContent>
            <CardFooter className="flex justify-between">
                <Button size={"sm"} asChild>
                    <Link href={"add-exam-item/"+id}>
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

export default ExamCardDetails