"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Pencil1Icon, Pencil2Icon, PlusIcon } from "@radix-ui/react-icons"
import Link from "next/link"
import { CreateExamDialog } from "./create-exam-dialog";
import { useParams } from "next/navigation";
import Authorized from "@/hoc/authorized";
import { ROLES_OBJ } from "../../constants/app.constants";
import { TGetExams, updateExamStatus } from "./action"
import { UpdateExamDialog } from "./update-exam-dialog"
import useErrorHandler from "@/hooks/useErrorHandler"
import { useToast } from "@/components/ui/use-toast"
import { useEffect } from "react"

export type TExamCardDetailsProps = TGetExams

const ExamCardDetails: React.FC<TExamCardDetailsProps> = ({ id, title, subject, startTime, endTime, type, isActive, description, scheduleDate, scheduleTime, noOfItems, studentCompleted, duration, subjectId }) => {
    const { handleNoError } = useErrorHandler();
    const { toast } = useToast();

    const handleUpdateExamStatus = async () => {
        const examStatus = await updateExamStatus({id});
        const hasNoError = handleNoError(examStatus, "Update Status");

        if (hasNoError) {
            toast({
                variant: "default",
                description: "Exam status has been updated.",
            }) 
        }
    }

    useEffect(() => {
        const handleVisibilityChange = () => {
          if (document.hidden) {
            // User switched to another tab or minimized the window
            console.log('Tab switched or window minimized');
          } else {
            // User came back to the tab
            console.log('User came back to the tab');
          }
        };
    
        document.addEventListener('visibilitychange', handleVisibilityChange);
    
        return () => {
          document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
      }, []); // Empty dependency array means this effect runs only once after the component mounts
    
    
    return (
        <Card className={`w-[450px] transition duration-300 ease-in-out hover:${isActive ? "border-blue-500" : "border-red-500"}`}>
            <CardHeader className="relative pb-0">
                <CardTitle className="text-xl m-0 flex items-center gap-2">{title} <UpdateExamDialog exam={{ id, title, subject, startTime, endTime, type, isActive, description, scheduleDate, scheduleTime, noOfItems, studentCompleted, duration, subjectId }} /></CardTitle>
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
                    <Link href={"exams/add-exam-item/" + id}>
                        <PlusIcon className="mr-2" />
                        Add Item
                    </Link>
                </Button>
                <Button size={"sm"} variant={`${isActive ? "destructive" : "default"}`} onClick={handleUpdateExamStatus}>
                    Set {isActive ? "Inactive" : "Active"}
                </Button>
            </CardFooter>
        </Card>
    )
}

export default ExamCardDetails