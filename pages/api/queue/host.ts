import { NextApiRequest, NextApiResponse } from "next";
import { getQueueByHostId } from "@/lib/queue";
import { buildGenericResponse } from "@/utils/response";
import { getAccountBySession } from "@/lib/account";
import Queue from "@/lib/models/queue.model";
import { Status } from "@/types/generic";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const account = await getAccountBySession(req, res);
  if (account) {
    const { userId } = account;
    const queue = await getQueueByHostId(userId?.toString());

    res.status(200).json(
      buildGenericResponse<Queue>({
        status: queue.status,
        data: queue.data,
        message: queue.message,
      })
    );
  } else {
    res.status(400).json(
      buildGenericResponse({
        status: Status.FAIL,
        message: "Could not find user/session",
      })
    );
  }
}
