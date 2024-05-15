import { CommandHandler } from "../types/interfaces/CommandHandler";
import { TCreateExamParams, TExam } from "../types/types/exam.type";
import ExamModel from "../models/Exam";
import { TGetRoomAssignmentBySubjectAndScheduleParams, TSubjectRoomAssignment } from "../types/types/subjectRoomAssignment";
import SubjectRoomAssignmentModel from "../models/SubjectRoomAssignment";
import SubjectModel from "../models/Subject";
import RoomModel from "../models/Room";
import { TUpdateSubjectRoomScheduleParams } from "../types/types/room.type";

export class UpdateSubjectRoomScheduleCommand implements CommandHandler<TUpdateSubjectRoomScheduleParams, TSubjectRoomAssignment> {
	async execute(params: TUpdateSubjectRoomScheduleParams): Promise<TSubjectRoomAssignment> {
        const subjectRoomAssignmentModel = new SubjectRoomAssignmentModel();
        const subjectModel = new SubjectModel();
        const roomModel = new RoomModel();

        const currentAssignedRoom = await subjectRoomAssignmentModel.GetSubjectAssignedRoom({id: params.id});
        if (!currentAssignedRoom) throw new Error("Subject schedule does not exists.");
        
        const getSubject = await subjectModel.GetSubjectByParams({id: params.subjectId});
        if (!getSubject) throw new Error("Selected subjects does not exists.");

        const getRoom = await roomModel.GetRoomByParams({ id: params.roomId });
        if (!getRoom) throw new Error("Selected room does not exists.");

        const checkDays = params.day.filter(day => currentAssignedRoom.day.includes(day));
        
        if(params.startTime !== currentAssignedRoom.startTime || params.endTime !== currentAssignedRoom.endTime || checkDays.length !== params.day.length) {
            console.log(!(currentAssignedRoom.startTime <= params.startTime && currentAssignedRoom.endTime >= params.startTime) || !(currentAssignedRoom.startTime <= params.endTime && currentAssignedRoom.endTime >= params.endTime))
            if (!(currentAssignedRoom.startTime <= params.startTime && currentAssignedRoom.endTime >= params.startTime) || !(currentAssignedRoom.startTime <= params.endTime && currentAssignedRoom.endTime >= params.endTime)) {
                console.log(2999)
                const getExistingSchedule = await subjectRoomAssignmentModel.GetRoomAssignmentBySubjectAndSchedule({subjectId: params.subjectId, roomId: params.roomId, day: params.day, startTime: params.startTime, endTime: params.endTime})
                console.log({getExistingSchedule})
                if (getExistingSchedule) throw new Error("Selected schedule is overlapping to the other subjects.");
            }
        }
        
        const updatedSubjectSchedule = await subjectRoomAssignmentModel.UpdateSubjectRoomSchedule(params);
        if (!updatedSubjectSchedule) throw new Error("Subject schedule updated.");

        return updatedSubjectSchedule;
    }
}
