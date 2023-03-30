type InternalSpotifySearchResponse<T> = {
  href: string;
  limit: number;
  next: string | null;
  offset: number;
  previous: string | null;
  total: number;
  items: T[];
};

type SpotifyTrackItemsResponse = {
  artists: {
    images: {
      url: string;
      height: number;
      width: number;
    }[];
    name: string;
    uri: string;
  }[];
  duration_ms: number;
  explicit: boolean;
  href: string;
  id: string;
  name: string;
  uri: string;
};

export type SpotifySearchResponse = {
  tracks?: InternalSpotifySearchResponse<SpotifyTrackItemsResponse>;
  artists?: InternalSpotifySearchResponse<unknown>; // not being used
  albums?: InternalSpotifySearchResponse<unknown>; // not being used
  playlists?: InternalSpotifySearchResponse<unknown>; // not being used
  shows?: InternalSpotifySearchResponse<unknown>; // not being used
  episodes?: InternalSpotifySearchResponse<unknown>; // not being used
  audiobooks?: InternalSpotifySearchResponse<unknown>; // not being used
};

export type TransformedSearchResponse = {
  name: string;
  id: string;
  uri: string;
  href: string;
  explicit: boolean;
  duration_ms: number;
  artists: {
    name: string;
    uri: string;
    images: {
      url: string | null;
      height: number;
      width: number;
    }[];
  }[];
}[];

type SpotifyPlaylistsResponse = {
  description: string;
  href: string;
  id: string;
  images: {
    url: string;
    width: number;
    height: number;
  }[];
  name: string;
  public: boolean;
  tracks: {
    href: string;
    total: number;
  };
  type: "playlist";
  uri: string;
};

export type PlaylistResponse =
  InternalSpotifySearchResponse<SpotifyPlaylistsResponse>;
