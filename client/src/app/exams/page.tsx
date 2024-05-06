"use server"
import { CreateExamDialog } from "./create-exam-dialog";
import ExamCardDetails from "./exam-card";
import { Suspense, use, useEffect } from "react";
import { getExams, TGetExams } from "./action";
import { unstable_noStore } from "next/cache";
import Spinner from "@/components/spinner";
import CustomBreadcrumb from "@/components/custom-breadcrumb";
import { LinkDetails } from "@/constants/app.constants";
import { Metadata } from "next";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function generateMetadata(): Promise<Metadata> {
    const session = await getSession();
    if (!session) redirect("/logout");

    return {
        title: "Exams",
    description: "List of your current exams",
    }
}

const ExamPage = async () => {
    unstable_noStore();
    const exams = await getExams();

    return (
        <div>
            <CustomBreadcrumb subLink={LinkDetails.exams}/>
            <Suspense fallback={<Spinner />}>
                <div className="my-5 flex items-center justify-between">
                    <h1 className="text-3xl font-bold ">Exams</h1>
                    <CreateExamDialog />
                </div>
                <div className="flex flex-wrap gap-5">
                    {
                        exams.map((items: TGetExams) => (
                            <ExamCardDetails key={items.title} {...items} />
                        ))
                    }
                </div>
            </Suspense>
        </div>
    )
}

export default ExamPage