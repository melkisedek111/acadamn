import { CommandHandler } from "../types/interfaces/CommandHandler";
import { TCreateRoomParams, TRoom } from "../types/types/room.type";
import RoomModel from "../models/Room";

export class CreateRoomCommand implements CommandHandler<TCreateRoomParams, TRoom> {
	async execute(params: TCreateRoomParams): Promise<TRoom> {
            const examModel = new RoomModel();
            
            const getRoomByName = await examModel.GetRoomByParams({ name: params.name });
            if (getRoomByName) throw new Error("Room name is already exists.");

            const newRoom = await examModel.CreateRoom(params);
            return newRoom;
        }
}
