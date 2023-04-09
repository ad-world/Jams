import { AddSongRequest } from "@/types/requsts";
import { ObjectId } from "mongodb";

export default interface Queue {
  hostId: ObjectId;
  requests: Omit<AddSongRequest, "queueId">[];
  queueId: ObjectId;
  connectedUsers: Array<{
    id: ObjectId | string;
    name: string;
  }>;
}
