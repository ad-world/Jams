import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { db } from "./db";
import Account from "./models/account.model";
import { ObjectId } from "mongodb";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export const getSpotifyToken = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const session = await getServerSession(req, res, authOptions);
  const sub = session?.user.id;

  const account = await getAccount(sub);

  return {
    token: account?.access_token ?? null,
    tokenType: account?.token_type ?? null,
  };
};

export const getAccount = async (accountId?: string) => {
  const account = await db()
    .collection<Account>("accounts")
    .findOne({ userId: new ObjectId(accountId) });

  return account;
};

export const getAccountBySession = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const session = await getServerSession(req, res, authOptions);
  const sub = session?.user?.id;

  const account = await getAccount(sub);

  return { ...account };
};
