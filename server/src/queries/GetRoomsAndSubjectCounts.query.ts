import RoomModel from "../models/Room";
import { QueryHandler } from "../types/interfaces/QueryHandler";
import { TGetRoomsAndSubjectCounts } from "../types/types/room.type";

export class GetRoomsAndSubjectCountsQuery implements QueryHandler<unknown, TGetRoomsAndSubjectCounts[]> {
    async execute(): Promise<TGetRoomsAndSubjectCounts[]> {
        const roomModel = new RoomModel();
        const rooms = await roomModel.GetRoomsWithSubjectCounts({});
        return rooms;
    }
}