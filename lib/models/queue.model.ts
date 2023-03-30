import { ObjectId } from "mongodb";

export default interface Queue {
  hostId: ObjectId;
  hostName: string;
  requests: any[];
  queueId: string;
  connectedUsers: Array<{
    id: string;
    name: string;
  }>;
}
