import { Task } from '../models/Task';
import { CommandHandler } from '../types/interfaces/CommandHandler';

type TCreateTaskCommand = {
    title: string;
    description: string;
}
export class CreateTaskCommand implements CommandHandler<TCreateTaskCommand, Task> {
    async execute({ title, description }: TCreateTaskCommand): Promise<Task> {
        // Simulate database insertion
        const id = Math.random().toString(36).substring(7);
        const task = new Task(id, title, description);
        // Return the created task
        return task;
    }
}