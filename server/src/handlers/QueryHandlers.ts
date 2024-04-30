import { CheckStudentIdQuery } from "../queries/CheckStudentId.query";
import { GetExamItemQuery } from "../queries/GetExamItem.query";
import { GetExamQuery } from "../queries/GetExams.query";
import { GetSubjectQuery } from "../queries/GetSubjects.query";
import { GetTasksQuery } from "../queries/GetTask.query";
import { LoginUserQuery } from "../queries/UserLogin.query";

export const QUERY_CLASSES = {
    LoginUserQuery: "LoginUserQuery",
    CheckStudentIdQuery: "CheckStudentIdQuery",
    GetSubjectQuery: "GetSubjectQuery",
    GetExamQuery: "GetExamQuery",
    GetExamItemQuery: "GetExamItemQuery",
}

type TQueryHandlers = typeof GetTasksQuery | typeof LoginUserQuery | typeof CheckStudentIdQuery | typeof GetSubjectQuery | typeof GetExamQuery | typeof GetExamItemQuery;

export const QueryHandlers: Record<string, InstanceType<TQueryHandlers>> = {
    GetTasksQuery: new GetTasksQuery(),
    [QUERY_CLASSES.LoginUserQuery]: new LoginUserQuery(),
    [QUERY_CLASSES.CheckStudentIdQuery]: new CheckStudentIdQuery(),
    [QUERY_CLASSES.GetSubjectQuery]: new GetSubjectQuery(),
    [QUERY_CLASSES.GetExamQuery]: new GetExamQuery(),
    [QUERY_CLASSES.GetExamItemQuery]: new GetExamItemQuery(),
};