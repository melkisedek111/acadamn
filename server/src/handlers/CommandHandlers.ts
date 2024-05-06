import { CreateExamCommand } from "../commands/CreateExam.command";
import { CreateExamItem } from "../commands/CreateExamItem.command";
import { CreateStudentIdentificationCommand } from "../commands/CreateStudentIdentification.command";
import { CreateSubjectCommand } from "../commands/CreateSubject.command";
import { CreateTaskCommand } from "../commands/CreateTask.command"; 
import { CreateUserCommand } from "../commands/CreateUser.command";
import { DeleteExamItem, HardDeleteExamItem } from "../commands/DeleteExamItem.command";
import { DeleteSpecificExamItemImageCommand } from "../commands/DeleteSpecificExamItemImage.command";
import { SetSubjectStatusCommand } from "../commands/SetSubjectStatus.command";
import { UpdateExamCommand } from "../commands/UpdateExam.command";
import { UpdateExamItemCommand } from "../commands/UpdateExamItem.command";
import { UpdateExamStatusCommand } from "../commands/UpdateExamStatus.command";
import { UpdateSubjectCommand } from "../commands/UpdateSubject.command";
import { CommandHandler } from "../types/interfaces/CommandHandler";

export const COMMAND_CLASSES = {
    CreateStudentIdentificationCommand: "CreateStudentIdentificationCommand",
    CreateUserCommand: "CreateUserCommand",
    CreateSubjectCommand: "CreateSubjectCommand",
    UpdateSubjectCommand: "UpdateSubjectCommand",
    SetSubjectStatusCommand: "SetSubjectStatusCommand",
    CreateExamCommand: "CreateExamCommand",
    CreateExamItem: "CreateExamItem",
    DeleteExamItem: "DeleteExamItem",
    HardDeleteExamItem: "HardDeleteExamItem",
    UpdateExamItemCommand: "UpdateExamItemCommand",
    DeleteSpecificExamItemImageCommand: "DeleteSpecificExamItemImageCommand",
    UpdateExamCommand: "UpdateExamCommand",
    UpdateExamStatusCommand: "UpdateExamStatusCommand",
}

export const CommandHandlers: Record<string, CommandHandler<any, any>> = {
    CreateTaskCommand: new CreateTaskCommand(),
    [COMMAND_CLASSES.CreateUserCommand]: new CreateUserCommand(),
    [COMMAND_CLASSES.CreateStudentIdentificationCommand]: new CreateStudentIdentificationCommand(),
    [COMMAND_CLASSES.CreateSubjectCommand]: new CreateSubjectCommand(),
    [COMMAND_CLASSES.UpdateSubjectCommand]: new UpdateSubjectCommand(),
    [COMMAND_CLASSES.SetSubjectStatusCommand]: new SetSubjectStatusCommand(),
    [COMMAND_CLASSES.CreateExamCommand]: new CreateExamCommand(),
    [COMMAND_CLASSES.CreateExamItem]: new CreateExamItem(),
    [COMMAND_CLASSES.DeleteExamItem]: new DeleteExamItem(),
    [COMMAND_CLASSES.HardDeleteExamItem]: new HardDeleteExamItem(),
    [COMMAND_CLASSES.UpdateExamItemCommand]: new UpdateExamItemCommand(),
    [COMMAND_CLASSES.DeleteSpecificExamItemImageCommand]: new DeleteSpecificExamItemImageCommand(),
    [COMMAND_CLASSES.UpdateExamCommand]: new UpdateExamCommand(),
    [COMMAND_CLASSES.UpdateExamStatusCommand]: new UpdateExamStatusCommand(),
};
