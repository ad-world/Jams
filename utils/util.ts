import { ArtistsObject } from "@/types/spotify";

export function serialize<T>(data: T): T {
  return JSON.parse(JSON.stringify(data));
}

export function sessionCode() {
  const max = 999999;
  const min = 100000;
  
  return Math.floor(
    Math.random() * (max - min + 1) + min
  )
}

export const reduceArtists = (artists: ArtistsObject[]) => {
  return artists.reduce((acc, cur) => {
    if (acc == '') return cur.name
    else return `${acc}, ${cur.name}`
  }, '');
}

export const formatMs = (ms: number) => {
  // Convert milliseconds to seconds
  const totalSeconds = Math.floor(ms / 1000);

  // Calculate minutes and remaining seconds
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  // Format the result as "m:s"
  const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  return formattedTime;
}