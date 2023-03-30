import { ObjectId } from "mongodb";

export default interface Account {
  provider: string;
  type: string;
  providerAccountId: string;
  access_token: string;
  token_type: string;
  expires_at: number;
  refresh_token: string;
  scope: string;
  userId: ObjectId;
}
