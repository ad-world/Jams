import { getAccount } from "@/lib/account";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import { ObjectId } from "mongodb";
import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import SpotifyProvider from "next-auth/providers/spotify";
import { connect, db } from "../../../lib/db";
import { createQueue, getQueueByHostId } from "@/lib/queue";
import { Status } from "@/types/generic";

const scope =
  "user-read-recently-played user-read-playback-state user-top-read user-modify-playback-state user-read-currently-playing user-follow-read playlist-read-private user-read-email user-read-private user-library-read playlist-read-collaborative";

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(connect()),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "database",
  },
  providers: [
    SpotifyProvider({
      authorization: {
        params: { scope },
      },
      clientId: process.env.CLIENT_ID! ?? "",
      clientSecret: process.env.CLIENT_SECRET ?? "",
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (!user) {
        return session;
      }
      session.user.id = user.id;

      const account = await getAccount(user.id);

      const currentQueue = await getQueueByHostId(user.id);
      if (currentQueue.status === Status.FAIL) {
        await createQueue(user.id);
      }

      if (account && Number(account?.expires_at) * 1000 < Date.now()) {
        try {
          const response = await fetch(
            "https://accounts.spotify.com/api/token",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: `Basic ${Buffer.from(
                  `${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`
                ).toString("base64")}`,
              },
              body: `grant_type=refresh_token&refresh_token=${account.refresh_token}`,
              cache: "no-cache",
            }
          );

          if (response.ok) {
            const data = await response.json();
            const { access_token, expires_in, token_type } = data;
            const timestamp = Math.floor(
              (Date.now() + expires_in * 1000) / 1000
            );

            await db()
              .collection("accounts")
              .updateOne(
                { userId: new ObjectId(user.id) },
                {
                  $set: {
                    access_token: access_token,
                    expires_in: timestamp,
                    token_type: token_type,
                  },
                }
              );
          } else {
            throw new Error(await response.json());
          }
        } catch (err) {
          console.error("Could not refresh token", JSON.stringify(err));
        }
      }

      return session;
    },
  },
};

declare module "next-auth/core/types" {
  interface Session {
    user: {
      id?: string;
    } & DefaultSession["user"];
  }
}

export default NextAuth(authOptions);
