import { CreateExamDialog } from "./create-exam-dialog";
import ExamCardDetails from "./exam-card";
import { Suspense, use, useEffect } from "react";
import { getExams, TGetExams } from "./action";
import { unstable_noStore } from "next/cache";
import Spinner from "@/components/spinner";

const ExamPage = async () => {
    unstable_noStore();
    const exams = await getExams();
    
    return (
        <div>
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