import { NextApiRequest, NextApiResponse } from "next";
import { getPlaylists } from "@/lib/spotify";
import { getAccountBySession } from "@/lib/account";
import { Status } from "@/types/generic";
import { buildGenericResponse } from "@/utils/response";
import { PlaylistResponse } from "@/types/spotify";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const account = await getAccountBySession(req, res);
  if (account) {
    const { userId, providerAccountId } = account;
    const playlists = await getPlaylists(providerAccountId, userId?.toString());

    res.status(200).json(
      buildGenericResponse<PlaylistResponse>({
        status: Status.SUCCESS,
        data: playlists,
      })
    );
  } else {
    res.status(400).json(
      buildGenericResponse({
        status: Status.FAIL,
        message: "Could not find user/session.",
      })
    );
  }
}
