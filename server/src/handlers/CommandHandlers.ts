import { AssignSubjectToRoomCommand } from "../commands/AssignSubjectToRoom.command";
import { CreateExamCommand } from "../commands/CreateExam.command";
import { CreateExamItem } from "../commands/CreateExamItem.command";
import { CreateRoomCommand } from "../commands/CreateRoom.command";
import { CreateStudentIdentificationCommand } from "../commands/CreateStudentIdentification.command";
import { CreateSubjectCommand } from "../commands/CreateSubject.command";
import { CreateUserCommand } from "../commands/CreateUser.command";
import { DeleteExamItem, HardDeleteExamItem } from "../commands/DeleteExamItem.command";
import { DeleteSpecificExamItemImageCommand } from "../commands/DeleteSpecificExamItemImage.command";
import { SetSubjectStatusCommand } from "../commands/SetSubjectStatus.command";
import { UpdateExamCommand } from "../commands/UpdateExam.command";
import { UpdateExamItemCommand } from "../commands/UpdateExamItem.command";
import { UpdateExamStatusCommand } from "../commands/UpdateExamStatus.command";
import { UpdateRoomCommand } from "../commands/UpdateRoom.command";
import { UpdateSubjectCommand } from "../commands/UpdateSubject.command";
import { UpdateSubjectRoomScheduleCommand } from "../commands/UpdateSubjectRoomSchedule.command";
import { CommandHandler } from "../types/interfaces/CommandHandler";

export const CommandHandlers: Record<string, CommandHandler<any, any>> = {
    CreateUserCommand: new CreateUserCommand(),
    CreateStudentIdentificationCommand: new CreateStudentIdentificationCommand(),
    CreateSubjectCommand: new CreateSubjectCommand(),
    UpdateSubjectCommand: new UpdateSubjectCommand(),
    SetSubjectStatusCommand: new SetSubjectStatusCommand(),
    CreateExamCommand: new CreateExamCommand(),
    CreateExamItem: new CreateExamItem(),
    DeleteExamItem: new DeleteExamItem(),
    HardDeleteExamItem: new HardDeleteExamItem(),
    UpdateExamItemCommand: new UpdateExamItemCommand(),
    DeleteSpecificExamItemImageCommand: new DeleteSpecificExamItemImageCommand(),
    UpdateExamCommand: new UpdateExamCommand(),
    UpdateExamStatusCommand: new UpdateExamStatusCommand(),
    CreateRoomCommand: new CreateRoomCommand(),
    UpdateRoomCommand: new UpdateRoomCommand(),
    AssignSubjectToRoomCommand: new AssignSubjectToRoomCommand(),
    UpdateSubjectRoomScheduleCommand: new UpdateSubjectRoomScheduleCommand(),
};

export const COMMAND_CLASSES: { [key in keyof typeof CommandHandlers]: string } = Object.keys(CommandHandlers).reduce((prev: any, current: string) => ({...prev, [current]: current}), {})