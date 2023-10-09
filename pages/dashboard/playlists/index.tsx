/* eslint-disable react/no-unescaped-entities */
import { signOut } from "next-auth/react";
import { serialize } from "@/utils/util";
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
    Image,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    SimpleGrid,
    Text,
    useDisclosure,
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

interface PlaylistItemProps {
    playlist: SpotifyPlaylistsResponse;
}

const PlaylistItem: React.FC<PlaylistItemProps> = ({ playlist }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    return (
        <Box bgColor={HONEY_DEW} maxW={"200px"} rounded="3xl" p={4}>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Modal Title</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>

                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={onClose}>
                            Close
                        </Button>
                        <Button variant='ghost'>Secondary Action</Button>
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
    playlist: PlaylistResponse | null;
    user: User | null;
}

export default function Playlist({ playlist, user }: PlaylistProps) {
    const hasNoSongs = playlist && playlist.total == 0;

    return (
        <Box minH={"100vh"} mx="auto" maxW={"100%"}>
            <Flex minH={"100vh"}>
                <Box w="300px" p={8}>
                    <VStack h="100%" justifyContent={"space-between"}>
                        <div>
                            <Heading size={"2xl"} mb={2}>
                                Jams.
                            </Heading>
                            <Text mb={10}>
                                <ArrowUpIcon color={"green"} /> Session is
                                active
                            </Text>

                            <Sidebar />
                        </div>
                        <Button
                            bgColor={MEDIUM_BLUE}
                            color={"white"}
                            _hover={{ bgColor: LIGHT_BLUE }}
                            onClick={() =>
                                signOut().then(() => (location.href = "/"))
                            }
                        >
                            Logout
                        </Button>
                    </VStack>
                </Box>
                {/* Main content */}
                <Box flex="1" p={8} bgColor={LIGHT_BLUE}>
                    <Heading size="2xl">
                        <Highlight
                            query={["Your Playlists"]}
                            styles={{
                                px: 3,
                                py: 2,
                                rounded: "full",
                                bg: LIGHT_PURPLE,
                            }}
                        >
                            Your Playlists
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
                                <PlaylistItem playlist={el} key={el.uri}/>
                            ))}
                        </SimpleGrid>
                    )}
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
    const serializedPlaylist = playlists ? serialize(playlists) : null;

    return {
        props: {
            playlist: serializedPlaylist,
            user: session?.user ?? null,
        },
    };
});
