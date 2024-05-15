import { CommandHandler } from "../types/interfaces/CommandHandler";
import { TCreateExamParams, TExam } from "../types/types/exam.type";
import ExamModel from "../models/Exam";
import { TGetRoomAssignmentBySubjectAndScheduleParams, TSubjectRoomAssignment } from "../types/types/subjectRoomAssignment";
import SubjectRoomAssignmentModel from "../models/SubjectRoomAssignment";
import SubjectModel from "../models/Subject";
import RoomModel from "../models/Room";

export class AssignSubjectToRoomCommand implements CommandHandler<TGetRoomAssignmentBySubjectAndScheduleParams, TSubjectRoomAssignment> {
	async execute(params: TGetRoomAssignmentBySubjectAndScheduleParams): Promise<TSubjectRoomAssignment> {
        const subjectRoomAssignmentModel = new SubjectRoomAssignmentModel();
        const subjectModel = new SubjectModel();
        const roomModel = new RoomModel();
        
        const getSubject = await subjectModel.GetSubjectByParams({id: params.subjectId});
        if (!getSubject) throw new Error("Selected subjects does not exists.");

        const getRoom = await roomModel.GetRoomByParams({ id: params.roomId });
        if (!getRoom) throw new Error("Selected room does not exists.");

        const getExistingSchedule = await subjectRoomAssignmentModel.GetRoomAssignmentBySubjectAndSchedule({subjectId: params.subjectId, roomId: params.roomId, day: params.day, startTime: params.startTime, endTime: params.endTime})
        if (getExistingSchedule) throw new Error("Selected schedule is overlapping to the other subjects.");
        
        const assignedSubjectRoom = await subjectRoomAssignmentModel.CreateSubjectRoomAssignment(params);;
        if (!assignedSubjectRoom) throw new Error("Subject is now assigned to the room");

        return assignedSubjectRoom;
    }
}
