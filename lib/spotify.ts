import {
  PlaylistResponse,
  QueueResponse,
  SpotifySearchResponse,
  TransformedSearchResponse,
} from "@/types/spotify";
import { trackSearchTransformer } from "@/utils/transformers";
import { authFetch } from "@/utils/fetcher";
import Queue from "./models/queue.model";

export const search = async (
  keywords: string | string[] | undefined,
  userId: string
): Promise<TransformedSearchResponse | null> => {
  try {
    if (keywords) {
      const parsedKeywords =
        typeof keywords === "string" ? keywords : keywords.join(",");
      const url = `${process.env.SPOTIFY_API}/search?q=${encodeURIComponent(
        parsedKeywords
      )}&type=track&limit=8`;

      const response = await authFetch<SpotifySearchResponse>(
        userId,
        url,
        "GET"
      );

      if(response.data) {
        return trackSearchTransformer(response.data);
      } else {
        return null;
      }
    } else {
      return null;
    }
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const getPlaylists = async (
  id: string | undefined,
  userId: string | undefined
): Promise<PlaylistResponse | null> => {
  try {
    const url = `${process.env.SPOTIFY_API}/users/${id}/playlists`;
    const response = await authFetch<PlaylistResponse>(userId, url, "GET");

    return response?.data ?? null;
  } catch (err) {
    console.error(err);
    return null;
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
): Promise<QueueResponse | null> => {
  try {
    const url = `${process.env.SPOTIFY_API}/me/player/queue`;
    const response = await authFetch<QueueResponse>(userId, url, "GET");

    return response?.data ?? null;
  } catch (err) {
    console.error(err);
    return null;
  }
};
