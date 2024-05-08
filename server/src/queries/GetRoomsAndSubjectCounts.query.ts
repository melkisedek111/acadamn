import { Task } from "../models/Task";
import { QueryHandler } from "../types/interfaces/QueryHandler";

export class GetRoomsAndSubjectCountsQuery implements QueryHandler<any, Task[]> {
    async execute(): Promise<Task[]> {
        // Simulate fetching tasks from the database
        return [
            new Task('1', 'Task 1', 'Description 1'),
            new Task('2', 'Task 2', 'Description 2')
        ];
    }
}