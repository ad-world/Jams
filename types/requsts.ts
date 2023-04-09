import { ObjectId } from "mongodb";

export interface AddSongRequest {
  name: string;
  uri: string;
  image: string;
  artists: string[];
  queueId: string | ObjectId;
  requestedBy: string;
  duration_ms: string;
}
