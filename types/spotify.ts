type InternalSpotifySearchResponse<T> = {
  href: string;
  limit: number;
  next: string | null;
  offset: number;
  previous: string | null;
  total: number;
  items: T[];
};

type ArtistsObject = {
  external_urls: {
    spotify: string;
  };
  followers: {
    href: string;
    total: number;
  };
  images: ImageObject[];
  genres: string[];
  href: string;
  id: string;
  name: string;
  popularity: number;
  type: "artist";
  uri: string;
};

type AlbumObject = {
  album_type: string;
  total_tracks: number;
  available_markets: string[];
  external_urls: string[];
  href: string;
  id: string;
  images: ImageObject[];
  name: string;
  release_date: string;
  type: "album";
  genres: string[];
  label: string;
  popularity: number;
  album_group: string;
  artists: Array<
    Omit<ArtistsObject, "followers" | "images" | "genres" | "popularity">
  >;
};

type ImageObject = {
  url: string;
  height: number;
  width: number;
};

type SpotifyTrackItemsResponse = {
  album: AlbumObject;
  artists: ArtistsObject[];
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
  images: ImageObject[];
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

export type SpotifyRecentlyPlayedResponse = Omit<
  InternalSpotifySearchResponse<SpotifyTrackItemsResponse>,
  "previous"
>;

export type QueueResponse = {
  currently_playing: SpotifyTrackItemsResponse;
  queue: Array<SpotifyTrackItemsResponse>;
};
