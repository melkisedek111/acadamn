import { CommandHandlers } from "../../handlers/CommandHandlers";
import { QueryHandlers } from "../../handlers/QueryHandlers";

abstract class AMediator {
    protected commandHandlers = {};
    protected queryHandlers = {};
    protected commandMiddlewares = {};
    protected queryMiddlewares = {};

    abstract registerCommandHandler<K extends keyof typeof CommandHandlers>(commandName: K, handler: typeof CommandHandlers[K]): void;
    abstract registerQueryHandler<K extends keyof typeof QueryHandlers>(queryName: K, handler: typeof QueryHandlers[K]): void;
    abstract useCommandMiddleware (middleware: Function): void;
    abstract useQueryMiddleware (middleware: Function): void;

    abstract sendCommand<T, R = void>(commandName: string, data: T): Promise<R>;
    abstract sendQuery<T, R = void>(queryName: string, data: T): Promise<R>;
}

export default AMediator;