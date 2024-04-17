// taskRoutes.ts
import { Router } from 'express';
import { loggingMiddleware } from '../middleware/logging.middleware';
import { TaskController } from '../controllers/Task.controller';

const taskRouter = Router();

// Apply logging middleware
taskRouter.use(loggingMiddleware);

// Create a task
taskRouter.post('/', TaskController.createTask);

// Get all tasks
taskRouter.get('/', TaskController.getTasks);

export default taskRouter;