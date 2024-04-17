export interface QueryHandler<Data, T> {
    execute(data: Data): Promise<T>;
}