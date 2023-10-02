import {
  PlaylistResponse,
  QueueResponse,
  SpotifySearchResponse,
} from "@/types/spotify";
import { trackSearchTransformer } from "@/utils/transformers";
import { authFetch } from "@/utils/fetcher";
import Queue from "./models/queue.model";

export const search = async (
  keywords: string | string[] | undefined,
  userId: string
) => {
  try {
    if (keywords) {
      const parsedKeywords =
        typeof keywords === "string" ? keywords : keywords.join(",");
      const url = `${process.env.SPOTIFY_API}/search?q=${encodeURIComponent(
        parsedKeywords
      )}&type=track&limit=8`;

      const response: SpotifySearchResponse = await authFetch(
        userId,
        url,
        "GET"
      );

      return trackSearchTransformer(response);
    }
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const getPlaylists = async (
  id: string | undefined,
  userId: string | undefined
): Promise<PlaylistResponse | undefined> => {
  try {
    const url = `${process.env.SPOTIFY_API}/users/${id}/playlists`;
    const response: PlaylistResponse = await authFetch(userId, url, "GET");

    return response;
  } catch (err) {
    console.error(err);
  }
};

export const acceptSong = async (songUri: string, userId: string) => {
  try {
    const url = `${process.env.SPOTIFY_API}/me/player/queue`;
    const response = await authFetch(userId, url, "POST", {
      uri: songUri,
    });

    return response;
  } catch (err) {
    console.error(err);
  }
};

export const getQueue = async (
  userId: string
): Promise<QueueResponse | undefined> => {
  try {
    const url = `${process.env.SPOTIFY_API}/me/player/queue`;
    const response: QueueResponse = await authFetch(userId, url, "GET");

    return response;
  } catch (err) {
    console.error(err);
  }
};
