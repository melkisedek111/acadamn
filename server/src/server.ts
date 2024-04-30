// server.ts
import express, { Request, Response } from "express";
import { stringSimilarity } from "string-similarity-js";
import Mediator from "./mediator/Mediator";
import { CommandHandlers } from "./handlers/CommandHandlers";
import { QueryHandlers } from "./handlers/QueryHandlers";
import { loggingMiddleware } from "./middleware/logging.middleware";
import bodyParser from "body-parser";
import taskRouter from "./routes/task.routes";
import { GetTasksQuery } from "./queries/GetTask.query";
import { PrismaClient } from "@prisma/client";
import userRouter from "./routes/user.routes";
import authRouter from "./routes/auth.routes";
import studentIdentificationRouter from "./routes/student-identification.routes";
import subjectRouter from "./routes/subject.routes";
import cors from "cors";
import cookieParser from "cookie-parser";
import examRoute from "./routes/exam.routes";
import examRouter from "./routes/exam.routes";
import examItemRouter from "./routes/examItem.routes";

// Create Express app
const app = express();
const PORT = process.env.PORT || 4000;

const options: cors.CorsOptions = {
	allowedHeaders: [
	  "Origin",
	  "X-Requested-With",
	  "Content-Type",
	  "Accept",
	  "X-Access-Token",
	],
	credentials: true,
	methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
	// whatever port for next.js
	origin: "http://localhost:3000",
	preflightContinue: true,
  };
// Middleware to parse JSON bodies
app.use(cookieParser());
app.use(cors(options));
app.use(express.json());
app.use(function(req, res, next) {  
	res.header('Access-Control-Allow-Origin', req.headers.origin);
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});
export const mediator = new Mediator();
export const prismaClient = new PrismaClient();

// Register command handlers
Object.entries(CommandHandlers).forEach(([commandName, handler]) => {
	mediator.registerCommandHandler(commandName, handler);
});

// Register query handlers
Object.entries(QueryHandlers).forEach(([queryName, handler]) => {
	mediator.registerQueryHandler(queryName, handler);
});

// Apply logging middleware to the mediator
// mediator.useCommandMiddleware(loggingMiddleware);
// mediator.useQueryMiddleware(loggingMiddleware);

// const w = stringSimilarity("The quick brown fox jumps over the lazy dog", "The quick over the lazy dog")

// console.log(w)

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/student-identification', studentIdentificationRouter);
app.use('/exam', examRouter);
app.use('/examItem', examItemRouter);
app.use('/user', userRouter);
app.use('/auth', authRouter);
app.use('/subject', subjectRouter);
app.use('/tasks', taskRouter);

// Start the server
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
