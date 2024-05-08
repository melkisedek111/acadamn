-- CreateTable
CREATE TABLE "InstructorSubjects" (
    "id" SERIAL NOT NULL,
    "subjectId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InstructorSubjects_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "InstructorSubjects" ADD CONSTRAINT "InstructorSubjects_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstructorSubjects" ADD CONSTRAINT "InstructorSubjects_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
