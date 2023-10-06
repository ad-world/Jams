import { AddSongRequest } from "@/types/requsts";
import { ObjectId } from "mongodb";

export default interface Queue {
  hostId: ObjectId;
  requests: Omit<AddSongRequest, "queueId">[];
  queueId: ObjectId;
  sessionCode: number;
  connectedUsers: Array<{
    id: ObjectId | string;
    name: string;
  }>;
}
