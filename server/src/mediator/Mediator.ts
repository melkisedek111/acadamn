import { CommandHandlers } from "../handlers/CommandHandlers";
import { QueryHandlers } from "../handlers/QueryHandlers";
import AMediator from "../types/abstracts/Mediator";

type CommandHandlerKeys = keyof typeof CommandHandlers;
type QueryHandlerKeys = keyof typeof QueryHandlers;

class Mediator extends AMediator {
    protected commandHandlers: typeof CommandHandlers;
    protected queryHandlers: typeof CommandHandlers;
    protected commandMiddlewares: Function[];
    protected queryMiddlewares: Function[];

    constructor() {
        super();
        this.commandHandlers = {};
        this.queryHandlers = {};
        this.commandMiddlewares = [];
        this.queryMiddlewares = [];
    }

    registerCommandHandler<K extends keyof typeof CommandHandlers>(commandName: K, handler: typeof CommandHandlers[K]) {
        this.commandHandlers[commandName] = handler;
    }

    registerQueryHandler<K extends keyof typeof QueryHandlers>(queryName: K, handler: typeof QueryHandlers[K]) {
        this.queryHandlers[queryName] = handler;
    }

    useCommandMiddleware(middleware: Function) {
        this.commandMiddlewares.push(middleware);
    }

    useQueryMiddleware(middleware: Function) {
        this.queryMiddlewares.push(middleware);
    }

    async sendCommand<T = any, R = void>(commandName: CommandHandlerKeys, data: T): Promise<R> {
        const handler = this.commandHandlers[commandName as CommandHandlerKeys];
        if (!handler) {
            throw new Error(`No command handler registered for ${commandName}`);
        }

        // for (const middleware of this.commandMiddlewares) {
        //     await middleware(commandName, data);
        // }

        return await handler.execute(data);
    }

    async sendQuery<T = any, R = void>(queryName: QueryHandlerKeys, data: T): Promise<R> {
        const handler = this.queryHandlers[queryName as QueryHandlerKeys];
        if (!handler) {
            throw new Error(`No query handler registered for ${queryName}`);
        }

        // for (const middleware of this.queryMiddlewares) {
        //     await middleware(queryName, data);
        // }

        return await handler.execute(data);
    }
}

export default Mediator;