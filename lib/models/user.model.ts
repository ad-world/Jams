import { ObjectId } from "mongodb";

export default interface User {
  name: string;
  email: string;
  image: string;
  emailVerified: string | null;
}
