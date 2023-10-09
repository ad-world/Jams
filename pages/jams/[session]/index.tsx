import PrimaryButton from "@/components/buttons/PrimaryButton";
import SecondaryButton from "@/components/buttons/SecondaryButton";
import SongSearch from "@/components/search/SongSearch";
import PublicSidebar from "@/components/sidebar/PublicSidebar";
import Sidebar from "@/components/sidebar/Sidebar";
import Queue from "@/lib/models/queue.model";
import { getQueueFromCode } from "@/lib/queue";
import { Status } from "@/types/generic";
import { SingleTransformedSearchResponse } from "@/types/spotify";
import { LIGHT_BLUE } from "@/utils/colors";
import { trpc } from "@/utils/trpc";
import { serialize } from "@/utils/util";
import { ArrowUpIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Box, Center, Flex, Heading, VStack, Text, HStack, Menu, MenuButton, Button, MenuList, MenuDivider, MenuItem } from "@chakra-ui/react";
import { GetServerSidePropsContext } from "next";

interface SessionProps {
    code: number,
    queue: Queue | null
}
export default function Session({ code, queue }: SessionProps) {
    const requestSong = trpc.addSongToQueue.useMutation();

    const chooseSong = async (track: SingleTransformedSearchResponse) => {
        await requestSong.mutateAsync({
            queueId: queue?.queueId.toString() ?? '',
            name: track.name,
            uri: track.uri, 
            image: track.album.images[0].url,
            artists: track.artists,
            duration_ms: track.duration_ms
        })
    }

    if (!queue) {
        return (
            <Center minH='100vh' minW='100vw'>
                <VStack>
                    <Heading size='md'>Error 404: Jam not found</Heading>
                    <PrimaryButton text="Return to homepage" onClick={() => location.href = '/'} />
                </VStack>
            </Center>
        )
    }

    return (
        <Box minH={'100vh'} maxW={"100%"} mx="auto">
            <Flex minH='100vh'>
                <Box w='300px' p={8}>
                    <VStack h="100%" justifyContent={"space-between"}>
                        <div>
                            <Heading size={"2xl"} mb={2}>
                                Jams.
                            </Heading>
                            <Text mb={10}>
                                <ArrowUpIcon color={"green"} /> Session is
                                active
                            </Text>
                            <PublicSidebar sessionCode={code} />
                        </div>
                    </VStack>
                </Box>
                <Box flex="1" bgColor={LIGHT_BLUE}>
                    <HStack minW='100%' bgColor="whiteAlpha.400" p={4} >
                        <SongSearch onChoose={chooseSong} mx='auto' userId={queue?.hostId.toString() ?? ''} />
                        <Menu >
							<MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
								Invite
							</MenuButton>
							<MenuList>
								<Heading m={3} size='sm'>Session Code: {queue?.sessionCode}</Heading>
								<MenuDivider></MenuDivider>
								<MenuItem>Copy session code to clipboard</MenuItem>
								<MenuItem>Copy session link to clipboard</MenuItem>
							</MenuList>
						</Menu>
                    </HStack>
                </Box>
            </Flex>
        </Box>

    )

}

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
    const sessionCode = context?.params?.session;

    if (typeof sessionCode == "string") {
        const numberCode = Number(sessionCode);
        const queue = await getQueueFromCode(numberCode);

        if (queue.status == Status.SUCCESS && queue.data) {
            const serialized = serialize(queue.data);
            return {
                props: {
                    code: numberCode,
                    queue: serialized
                }
            }
        }
    }

    return {
        props: {
            code: Number(sessionCode),
            queue: null
        }
    }
}