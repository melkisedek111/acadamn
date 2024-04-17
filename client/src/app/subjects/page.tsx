import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import CreateSubjectFormDialog from './create-subject-form'
import SubjectsTable from './subjects-table'
import { unstable_noStore } from 'next/cache'

const Subjects = () => {
    unstable_noStore();
    
    return (
        <div>
            <div className="my-5 flex items-center justify-between">
                <h1 className="text-3xl font-bold ">Subjects</h1>
                <CreateSubjectFormDialog />
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Subject List</CardTitle>
                </CardHeader>
                <CardContent>
                    <SubjectsTable />
                </CardContent>
            </Card>
        </div>
    )
}

export default Subjects;