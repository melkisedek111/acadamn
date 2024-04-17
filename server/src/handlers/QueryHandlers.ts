import { CheckStudentIdQuery } from "../queries/CheckStudentId.query";
import { GetSubjectQuery } from "../queries/GetSubjects.query";
import { GetTasksQuery } from "../queries/GetTask.query";
import { LoginUserQuery } from "../queries/UserLogin.query";

export const QUERY_CLASSES = {
    LoginUserQuery: "LoginUserQuery",
    CheckStudentIdQuery: "CheckStudentIdQuery",
    GetSubjectQuery: "GetSubjectQuery"
}

type TQueryHandlers = typeof GetTasksQuery | typeof LoginUserQuery | typeof CheckStudentIdQuery | typeof GetSubjectQuery;

export const QueryHandlers: Record<string, InstanceType<TQueryHandlers>> = {
    GetTasksQuery: new GetTasksQuery(),
    [QUERY_CLASSES.LoginUserQuery]: new LoginUserQuery(),
    [QUERY_CLASSES.CheckStudentIdQuery]: new CheckStudentIdQuery(),
    [QUERY_CLASSES.GetSubjectQuery]: new GetSubjectQuery(),
};