export interface CommandHandler<Data, T> {
    execute(data: Data): Promise<T>;
}