import {
  SpotifySearchResponse,
  TransformedSearchResponse,
} from "@/types/spotify";

export const trackSearchTransformer = (
  data: SpotifySearchResponse
): TransformedSearchResponse => {
  const transformed: TransformedSearchResponse =
    data.tracks?.items.map((item) => {
      return {
        artists: item.artists,
        album: item.album,
        duration_ms: item.duration_ms,
        explicit: item.explicit,
        href: item.href,
        id: item.id,
        name: item.name,
        uri: item.uri,
      };
    }) ?? [];

  return transformed;
};
