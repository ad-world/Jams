/* eslint-disable react/no-unescaped-entities */
import { signOut } from "next-auth/react";
import { formatMs, reduceArtists, serialize } from "@/utils/util";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]";
import { getPlaylists } from "@/lib/spotify";
import { getAccount } from "@/lib/account";
import {
    Box,
    Button,
    Center,
    Flex,
    Heading,
    Highlight,
    HStack,
    Image,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    others,
    SimpleGrid,
    Spinner,
    Text,
    useDisclosure,
    useToast,
    VStack,
} from "@chakra-ui/react";
import Sidebar from "@/components/sidebar/Sidebar";
import {
    HONEY_DEW,
    LIGHT_BLUE,
    LIGHT_PURPLE,
    MEDIUM_BLUE,
} from "@/utils/colors";
import { requireAuth } from "@/utils/auth";
import { PlaylistResponse, SpotifyPlaylistsResponse } from "@/types/spotify";
import { Link } from "@chakra-ui/react";
import { ArrowUpIcon } from "@chakra-ui/icons";
import { getQueueFromCode } from "@/lib/queue";
import PublicSidebar from "@/components/sidebar/PublicSidebar";
import PublicLayout from "@/components/layouts/PublicLayout";
import { trpc } from "@/utils/trpc";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import SecondaryButton from "@/components/buttons/SecondaryButton";
import Queue from "@/lib/models/queue.model";
import { UpdateQueueEvent } from "@/types/socket";
import { io, Socket } from "socket.io-client";
import { useEffect } from "react";

let socket: Socket;

interface PlaylistItemProps {
    playlist: SpotifyPlaylistsResponse;
    userId: string
    queueId: string
}

const PlaylistItem: React.FC<PlaylistItemProps> = ({ playlist, userId, queueId }) => {
    const requestSong = trpc.addSongToQueue.useMutation();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { data, isLoading, refetch } = trpc.getPlaylist.useQuery({playlist: playlist.id, userId}, { enabled: false });
    const toast = useToast();

    useEffect(() => {
        const socketInitializer = async () => {
            try {
                await fetch('/api/socket');

                socket = io();

                socket.on('connect', () => {
                    console.log('Connected to websocket server');
                });
            } catch (error) {
                console.error('Error initializing socket:', error);
            }
        };

        // Initialize the socket when the component mounts
        socketInitializer();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
    return (
        <Box bgColor={HONEY_DEW} maxW={"200px"} rounded="3xl" p={4} onClick={() => {
            onOpen();
            refetch();
        }}>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent minW='600px'>
                    <ModalHeader>View Playlist</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody minW='600px' maxH='600px'>
                        { isLoading ? <Spinner /> : (
                            <>
                            <HStack mb={10}>
                                <Image src={data?.data?.images[0].url} w={150} alt={data?.data?.name}/>
                                <VStack alignItems={'flex-start'}>
                                    <Heading>{data?.data?.name}</Heading>
                                    <Text>{data?.data?.description}</Text>
                                </VStack>
                            </HStack>
                            <VStack overflowY={'scroll'} w="100%" maxH={'400px'}>
                               {data?.data?.tracks.items.map((item, index) => (
                                    <Box w='100%' key={index}>
                                        <HStack justifyContent={'space-between'} w='95%'>
                                            <HStack>
                                                <Image src={item.track.album.images[0].url} w={50} alt={item.track.name}></Image>
                                                <VStack alignItems={'flex-start'}>
                                                    <Text textAlign={'left'} fontWeight={700}>{item.track.name}</Text>
                                                    <Text>{reduceArtists(item.track.artists)}</Text>
                                                </VStack>
                                            </HStack>
                                            <PrimaryButton text="Request song" onClick={async () => {
                                                await requestSong.mutateAsync({
                                                    queueId: queueId,
                                                    name: item.track.name,
                                                    uri: item.track.uri,
                                                    image: item.track.album.images[0].url,
                                                    artists: item.track.artists,
                                                    duration_ms: item.track.duration_ms,
                                                });

                                                if (socket) {
                                                    socket.emit("queue-updated", { queueId: queueId })
                                                }

                                                toast({
                                                    colorScheme: 'green',
                                                    variant: 'solid',
                                                    title: 'Success',
                                                    description: `${item.track.name} - ${reduceArtists(item.track.artists)} has been requested`,
                                                    position: 'top',
                                                    isClosable: true

                                                })
                                            }}></PrimaryButton>
                                        </HStack>
                                    </Box>
                               ))}
                            </VStack>
                            </>
                        )}
                    </ModalBody>

                    <ModalFooter>
                        <SecondaryButton onClick={onClose} text="Close"/>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <Image
                alt={`${playlist.name} image`}
                src={playlist.images[0].url}
                rounded="xl"
            ></Image>
            <Center mt={2}>
                <Heading size="sm">{playlist.name}</Heading>
            </Center>
        </Box>
    );
};

interface PlaylistProps {
    sessionCode: number;
    playlist: PlaylistResponse | null;
    queue: Queue | null;
    userId: string
}

export default function Playlist({ playlist, userId, sessionCode, queue }: PlaylistProps) {
    const hasNoSongs = playlist && playlist.total == 0;

    return (
        <PublicLayout sessionCode={sessionCode} p={8}>
            <Heading size="2xl">
                <Highlight
                    query={["Jam Playlists"]}
                    styles={{
                        px: 3,
                        py: 2,
                        rounded: "full",
                        bg: LIGHT_PURPLE,
                    }}
                >
                    Jam Playlists
                </Highlight>
            </Heading>
            {hasNoSongs ? (
                <Center minH="80%">
                    <Heading size="lg">
                        <Text>You don't have any songs.</Text>
                        <Link
                            href={"https://dubstepai.world"}
                            _hover={{ bgColor: HONEY_DEW }}
                            rounded="full"
                            px={3}
                            py={2}
                        >
                            Head over to dubstepai.world
                        </Link>
                    </Heading>
                </Center>
            ) : (
                <SimpleGrid
                    mt={16}
                    minChildWidth="200px"
                    spacingY={"20px"}
                    spacingX="20px"
                >
                    {playlist?.items.map((el) => (
                        <PlaylistItem playlist={el} key={el.uri} userId={userId} queueId={queue?.queueId.toString() ?? ''}/>
                    ))}
                </SimpleGrid>
            )}
        </PublicLayout>
    );
}

export const getServerSideProps = requireAuth(async (context) => {
    const session = Number(context.params?.session);
    const queue = await getQueueFromCode(session);

    const userId = queue?.data?.hostId.toString();
    const account = await getAccount(userId);
    const playlists = await getPlaylists(account?.providerAccountId, userId);
    const serializedPlaylist = playlists ? serialize(playlists) : null;
    const serializedQueue = queue ? serialize(queue) : null;

    return {
        props: {
            playlist: serializedPlaylist ?? null,
            sessionCode: session,
            queue: serializedQueue?.data,
            userId,
        },
    };
});
