import Queue from "./models/queue.model";
import { db } from "./db";
import { ObjectId } from "mongodb";
import { Status } from "@/types/generic";
import { AddSongRequest } from "@/types/requsts";

export const createQueue = async (accountId?: string) => {
  const queue: Queue = {
    hostId: new ObjectId(accountId),
    requests: [],
    queueId: new ObjectId(),
    connectedUsers: [],
  };
  const result = await db().collection<Queue>("queues").insertOne(queue);
  return result.insertedId;
};

export const getQueueByHostId = async (hostId?: string) => {
  const queue = await db()
    .collection<Queue>("queues")
    .findOne({ hostId: new ObjectId(hostId) });

  if (!queue) {
    return {
      status: Status.FAIL,
      message: `Could not find queue for host ${hostId}`,
    };
  }

  return {
    status: Status.SUCCESS,
    data: queue,
  };
};

export const joinSession = async (queueId: string | ObjectId, name: string) => {
  const queue = await db()
    .collection<Queue>("queues")
    .findOne({ queueId: new ObjectId(queueId) });

  if (!queue) {
    return {
      status: Status.FAIL,
      message: "Queue not found.",
    };
  }

  const id = new ObjectId();

  const updated = await db()
    .collection<Queue>("queues")
    .updateOne(
      { queueId: new ObjectId(queueId) },
      {
        $push: {
          connectedUsers: {
            name,
            id,
          },
        },
      }
    );

  if (updated.modifiedCount === 0) {
    return {
      status: Status.FAIL,
      message: "Failed to add user to session. Please try again.",
    };
  }

  return {
    status: Status.SUCCESS,
    message: `${name} succesfully added to the session.`,
    id,
  };
};

export const deleteQueue = async (queueId: string | ObjectId) => {
  const deleteResult = await db()
    .collection<Queue>("queues")
    .deleteOne({ queueId: new ObjectId(queueId) });

  if (deleteResult.deletedCount === 0) {
    return {
      status: Status.FAIL,
      message: `Could not delete queue with ID ${queueId}`,
    };
  }

  return {
    status: Status.SUCCESS,
    message: "Queue deleted",
  };
};

export const addSongToQueue = async (request: AddSongRequest) => {
  const { queueId } = request;

  const updateResult = await db()
    .collection<Queue>("queues")
    .updateOne(
      {
        queueId: new ObjectId(queueId),
      },
      {
        $push: {
          requests: {
            name: request.name,
            uri: request.uri,
            image: request.image,
            artists: request.artists,
            requestedBy: request.requestedBy,
            duration_ms: request.duration_ms,
          },
        },
      }
    );

  if (updateResult.upsertedCount === 0) {
    return {
      status: Status.FAIL,
      message: "Could not add song to queue.",
    };
  }

  return {
    status: Status.SUCCESS,
    message: "Song added to queue.",
  };
};
