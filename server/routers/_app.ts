import { deleteHostQueue } from '@/lib/queue';
import { search } from '@/lib/spotify';
import { z } from 'zod';
import { procedure, router } from '../trpc';
export const appRouter = router({
    logout: procedure
        .input(
            z.object({
                hostId: z.string()
            })
        )
        .mutation((opts) => {
            const { hostId } = opts.input;
            return deleteHostQueue(hostId);
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
        })
});
// export type definition of API
export type AppRouter = typeof appRouter;