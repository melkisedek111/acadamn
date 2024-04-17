import { CreateExamCommand } from "../commands/CreateExam.command";
import { CreateStudentIdentificationCommand } from "../commands/CreateStudentIdentification.command";
import { CreateSubjectCommand } from "../commands/CreateSubject.command";
import { CreateTaskCommand } from "../commands/CreateTask.command"; 
import { CreateUserCommand } from "../commands/CreateUser.command";
import { SetSubjectStatusCommand } from "../commands/SetSubjectStatus.command";
import { UpdateSubjectCommand } from "../commands/UpdateSubject.command";
import { CommandHandler } from "../types/interfaces/CommandHandler";

export const COMMAND_CLASSES = {
    CreateStudentIdentificationCommand: "CreateStudentIdentificationCommand",
    CreateUserCommand: "CreateUserCommand",
    CreateSubjectCommand: "CreateSubjectCommand",
    UpdateSubjectCommand: "UpdateSubjectCommand",
    SetSubjectStatusCommand: "SetSubjectStatusCommand",
    CreateExamCommand: "CreateExamCommand",
}

export const CommandHandlers: Record<string, CommandHandler<any, any>> = {
    CreateTaskCommand: new CreateTaskCommand(),
    [COMMAND_CLASSES.CreateUserCommand]: new CreateUserCommand(),
    [COMMAND_CLASSES.CreateStudentIdentificationCommand]: new CreateStudentIdentificationCommand(),
    [COMMAND_CLASSES.CreateSubjectCommand]: new CreateSubjectCommand(),
    [COMMAND_CLASSES.UpdateSubjectCommand]: new UpdateSubjectCommand(),
    [COMMAND_CLASSES.SetSubjectStatusCommand]: new SetSubjectStatusCommand(),
    [COMMAND_CLASSES.CreateExamCommand]: new CreateExamCommand(),
};
