import { NextApiRequest, NextApiResponse } from "next";
import { search } from "@/lib/spotify";
import { getAccountBySession, getSpotifyToken } from "@/lib/account";
import { buildGenericResponse } from "@/utils/response";
import { Status } from "@/types/generic";
import { TransformedSearchResponse } from "@/types/spotify";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { userId } = await getAccountBySession(req, res);
    const keywords = req.query.keywords;
    const songs = await search(keywords, userId?.toString() ?? "");

    return res.status(200).json(
      buildGenericResponse<TransformedSearchResponse>({
        status: Status.SUCCESS,
        data: songs,
      })
    );
  } catch (err) {
    return res.status(400).json(
      buildGenericResponse({
        status: Status.FAIL,
        message: "Could not search for songs. Error: " + err,
      })
    );
  }
}
