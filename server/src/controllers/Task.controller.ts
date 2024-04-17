// TaskController.ts
import { Request, Response } from 'express';
import { mediator } from '../server';

export class TaskController {
    static async createTask(req: Request, res: Response) {
        const { title, description } = req.body;
        const task = await mediator.sendCommand('CreateTaskCommand', { title, description });
        res.json(task);
    }

    static async getTasks(req: Request, res: Response) {
        const tasks = await mediator.sendQuery('GetTasksQuery', {});
        res.json(tasks);
    }
}