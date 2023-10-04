import { signOut, useSession } from "next-auth/react";
import { useSerialize } from "@/utils/hooks";
import Queue from "@/lib/models/queue.model";
import { Status } from "@/types/generic";
import { getServerSession, User } from "next-auth";
import { GetServerSidePropsContext } from "next";
import { authOptions } from "../../api/auth/[...nextauth]";
import { getQueueByHostId } from "@/lib/queue";
import { getPlaylists } from "@/lib/spotify";
import { getAccount, getAccountBySession } from "@/lib/account";
import {
    Box,
    Button,
    Center,
    Flex,
    Heading,
    Highlight,
    VStack,
} from "@chakra-ui/react";
import Sidebar from "@/components/sidebar/Sidebar";
import { BG_PURPLE, HONEY_DEW, LIGHT_BLUE, LIGHT_PURPLE, MAIN_PURPLE, MEDIUM_BLUE } from "@/utils/colors";
import { requireAuth } from "@/utils/auth";
import { PlaylistResponse } from "@/types/spotify";
import { Link } from "@chakra-ui/react";

interface PlaylistProps {
    playlist: PlaylistResponse | null;
    user: User | null
}

export default function Dashboard({ playlist, user }: PlaylistProps) {

    const hasNoSongs = true // playlist && playlist.total == 0;

    return (
        <Box minH={"100vh"} minW={"100vw"}>
            <Flex minH={"100vh"}>
                <Box w="300px" p={8}>
                    <VStack h='100%' justifyContent={'space-between'}>
                        <div>
                            <Heading size={"2xl"} mb={12}>
                                Jams.
                            </Heading>
                            <Sidebar />
                        </div>
                        <Button bgColor={MEDIUM_BLUE} color={'white'} _hover={{ bgColor: LIGHT_BLUE }} onClick={() => signOut().then(() => location.href = "/")}>
                            Logout
                        </Button>
                    </VStack>
                </Box>
                {/* Main content */}
                <Box flex="1" p={8} bgColor={LIGHT_BLUE}>
                    <Heading size="2xl">
                        <Highlight query={['Your Playlists']} styles={{ px: 3, py: 2, rounded: 'full', bg: LIGHT_PURPLE }}>
                            Your Playlists
                        </Highlight>
                    </Heading>
                    { hasNoSongs ? (
                        <Center h='100%' w='100%'>
                            <Heading size='lg'>
                                You don't have any songs. 
                                <Link href={"https://dubstepai.world"} _hover={{bgColor: HONEY_DEW}} rounded='full' px={3} py={2}>
                                    Head over to dubstepai.world
                                </Link>
                            </Heading>
                        </Center>
                    ) : null}
                </Box>
            </Flex>
        </Box>
    );
}

export const getServerSideProps = requireAuth(async (context) => {
    const session = await getServerSession(
        context.req,
        context.res,
        authOptions
    );

    const sub = session?.user.id;

    const account = await getAccount(sub);
    const playlists = await getPlaylists(account?.providerAccountId, sub);
    console.log(playlists);
    
    const serializedPlaylist = playlists ? useSerialize(playlists) : null;

    return {
        props: {
            playlist: serializedPlaylist,
            user: session?.user ?? null
        },
    };
});
