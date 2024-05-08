export type TRoom = {
    id: number;
    name: string;
}

export type TCreateRoomParams = Pick<TRoom, "name">;
export type TGetRoomByParams = Partial<TRoom>;