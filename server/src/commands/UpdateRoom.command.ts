import { CommandHandler } from "../types/interfaces/CommandHandler";
import { TGetRoomsAndSubjectCounts,  TUpdateRoomParams } from "../types/types/room.type";
import RoomModel from "../models/Room";

export class UpdateRoomCommand implements CommandHandler<TUpdateRoomParams, TGetRoomsAndSubjectCounts> {
	async execute(params: TUpdateRoomParams): Promise<TGetRoomsAndSubjectCounts> {
        const roomModel = new RoomModel();

        const room = await roomModel.GetRoomByParams({id: params.id});
        if (!room) throw new Error("Room does not exists.");
        console.log({params})
        if(room.name !== params.name) {
            const getRoomByName = await roomModel.GetRoomByParams({name: params.name});
            if (getRoomByName) throw new Error("Room name already exists.!");
        }

        const updatedRoom = await roomModel.UpdateRoom(params);

        if (!updatedRoom) throw new Error("Updating room failed.!");

        return updatedRoom;

    }
}
