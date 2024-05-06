"use client";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast";
import { Check, X } from "lucide-react"
import { useState } from "react";
import { setSubjectStatus } from "./action";
import { signOut } from "next-auth/react";

type TSetSubjectStatusDialogProps = {
    subjectId: number;
    isActive: boolean;
}

export function SetSubjectStatusDialog({ subjectId, isActive}: TSetSubjectStatusDialogProps) {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { toast } = useToast();

    const handleSetSubjectStatus = async () => {
        try {
            setIsLoading(true);
            const response = await setSubjectStatus({id: subjectId});

            if ("error" in response) {

                if(response.error === "Unauthenticated") {
                    signOut({
                        redirect: false,
                        callbackUrl: "/login"
                    });
                    return;
                }

                for (const error of response.details) {
                    toast({
                        variant: "destructive",
                        title: "Subject Status Failed",
                        description: error.message,
                    })
                }

                return;
            }

            toast({
                variant: "default",
                title: "Set Subject Status!",
                description: "Subject status is set to " + isActive ? "Inactive" : "Active",
            })
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }
    
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant={`${isActive ? "destructive" : "default"}`} size="sm">
                    {
                        isActive ? <X /> : <Check />
                    }
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Set the subject to <span className="font-bold">{isActive ? "Inactive" : "Active"}</span></AlertDialogTitle>
                    <AlertDialogDescription>
                        This action will set the subject to <span className="font-bold">{isActive ? "Inactive" : "Active"}</span>, and may affect the other data that are related to the subject.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
                    <AlertDialogAction disabled={isLoading} onClick={handleSetSubjectStatus}>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
