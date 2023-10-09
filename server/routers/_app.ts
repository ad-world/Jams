import { addSongToQueue, deleteHostQueue } from '@/lib/queue';
import { acceptSong, getQueue, search } from '@/lib/spotify';
import { z } from 'zod';
import { procedure, router } from '../trpc';
import { AddSongRequest } from '@/types/requsts';
import { reduceArtists } from '@/utils/util';
export const appRouter = router({
    logout: procedure
        .input(
            z.object({
                hostId: z.string()
            })
        )
        .mutation((opts) => {
            const { hostId } = opts.input;
            deleteHostQueue(hostId);
        }),
    search: procedure
        .input(
            z.object({
                keywords: z.string().or(z.array(z.string())),
                userId: z.string()
            })
        )
        .query(async (opts) => {
            const { userId, keywords } = opts.input;
            if(keywords.length < 3) return null; 

            const response = await search(keywords, userId); 

            return response;
        }),
    acceptSong: procedure.
        input(
            z.object({
                songUri: z.string(),
                userId: z.string()
            })
        )
        .mutation(async (opts) => {
            const { songUri, userId} = opts.input;
            const response = await acceptSong(songUri, userId);
            console.log(response);
        }),
    getQueue: procedure.
        input(
            z.object({
                userId: z.string()
            })
        )
        .query(async (opts) => {
            const { userId } = opts.input;
            return await getQueue(userId);
        }),
    addSongToQueue: procedure.
        input(
            z.object({
                queueId: z.string(),
                name: z.string(),
                uri: z.string(),
                image: z.string(),
                artists: z.array(z.any()),
                duration_ms: z.number()
            })
        ).mutation(async (opts) => {
            const { queueId, name, uri, image, artists, duration_ms } = opts.input;
            const request: AddSongRequest = {
                queueId,
                name, 
                uri,
                image, 
                artists: reduceArtists(artists),
                duration_ms,
                requestedBy: "guest"
            }

            await addSongToQueue(request)
        })

});
// export type definition of API
export type AppRouter = typeof appRouter;