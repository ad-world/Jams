import PrimaryButton from "@/components/buttons/PrimaryButton";
import SongSearch from "@/components/search/SongSearch";
import Queue from "@/lib/models/queue.model";
import { getQueueFromCode } from "@/lib/queue";
import { Status } from "@/types/generic";
import { QueueResponse, SingleTransformedSearchResponse } from "@/types/spotify";
import { trpc } from "@/utils/trpc";
import { reduceArtists, serialize  } from "@/utils/util";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { Center, Heading, VStack, HStack, Menu, MenuButton, Button, MenuList, MenuDivider, MenuItem, Grid, GridItem, Box, Divider, Image, Text, useToast } from "@chakra-ui/react";
import { GetServerSidePropsContext } from "next";
import { useEffect, useState } from "react";
import PublicLayout from "@/components/layouts/PublicLayout";

import { io, type Socket } from 'socket.io-client'
import { HONEY_DEW } from "@/utils/colors";
import SecondaryButton from "@/components/buttons/SecondaryButton";
import { getQueue } from "@/lib/spotify";
import { UpdateQueueEvent } from "@/types/socket";

let socket: Socket;

interface SessionProps {
    code: number,
    queue: Queue | null,
    spotifyQueue: QueueResponse | null;
}
export default function Session({ code, queue, spotifyQueue }: SessionProps) {
    const requestSong = trpc.addSongToQueue.useMutation();
    const { data: requestQueueData, refetch: refetchQueueData } = trpc.getJamQueue.useQuery({ queueId: queue?.queueId.toString() ?? '' })
    const { data: spotifyQueueData, refetch: refetchSpotifyQueue } = trpc.getQueue.useQuery({ userId: queue?.hostId.toString() ?? '' })
    const [displayedRequestQueue, setDisplayedRequestQueue] = useState<Queue | null>(queue);
    const [displayedQueue, setDisplayedQueue] = useState<QueueResponse | null>(spotifyQueue);
    const toast = useToast();

    const copyLinkToClipboard = async (sessionCode?: number) => {
		await navigator.clipboard.writeText(window.location.origin + '/jams/' + sessionCode);
		toast({
			title: 'Success',
			colorScheme: 'green',
			variant: 'solid',
			description: 'Jam link copied to the clipboard.',
			isClosable: true,
			position: 'top'
		})
	}

	const copyCodeToClipboard = async (sessionCode?: number) => {
		await navigator.clipboard.writeText(sessionCode?.toString() ?? '');
		toast({
			title: 'Success',
			colorScheme: 'green',
			variant: 'solid',
			description: 'Jam code copied to the clipboard.',
			isClosable: true,
			position: 'top'
		})
	}

    useEffect(() => {
        if (requestQueueData != undefined && queue != null) {
			const newQueueData: Queue = {
				...queue,
				requests: requestQueueData.data?.requests ?? [],
				hostId: queue.hostId,
				queueId: queue.queueId,
				connectedUsers: [], // todo: change this?
				sessionCode: queue.sessionCode ?? 0
			}

			setDisplayedRequestQueue(newQueueData);
		}
    }, [requestQueueData, queue])

    useEffect(() => {
        if(spotifyQueueData) {
            setDisplayedQueue(spotifyQueueData);
        }
    }, [spotifyQueueData])
    
    useEffect(() => {
        const socketInitializer = async () => {
            try {
                await fetch('/api/socket');

                socket = io();

                socket.on('connect', () => {
                    console.log('Connected to websocket server');
                });

                socket.on('refresh-jam', (data: UpdateQueueEvent) => {
                    if(data.queueId === queue?.queueId.toString()) {
                        setTimeout(() => {
                            refetchQueueData();
                            refetchSpotifyQueue();
                        }, 1000);
                    }
                })

            } catch (error) {
                console.error('Error initializing socket:', error);
            }
        };

        // Initialize the socket when the component mounts
        socketInitializer();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const chooseSong = async (track: SingleTransformedSearchResponse) => {
        await requestSong.mutateAsync({
            queueId: queue?.queueId.toString() ?? '',
            name: track.name,
            uri: track.uri,
            image: track.album.images[0].url,
            artists: track.artists,
            duration_ms: track.duration_ms,
        });

        if (socket) {
            socket.emit("queue-updated", { queueId: queue?.queueId })
            setTimeout(() => refetchQueueData(), 1000);
        }
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
        <PublicLayout sessionCode={code} minHeight={'100%'}>
            <HStack minW='100%' bgColor="whiteAlpha.400" p={4} >
                <SongSearch onChoose={chooseSong} mx='auto' userId={queue?.hostId.toString() ?? ''} />
                <Menu >
                    <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                        Invite
                    </MenuButton>
                    <MenuList>
                        <Heading m={3} size='sm'>Session Code: {queue?.sessionCode}</Heading>
                        <MenuDivider></MenuDivider>
                        <MenuItem onClick={async () => copyCodeToClipboard(code)}>Copy session code to clipboard</MenuItem>
                        <MenuItem onClick={async () => copyLinkToClipboard(code)}>Copy session link to clipboard</MenuItem>
                    </MenuList>
                </Menu>
            </HStack>
            <Grid templateColumns='repeat(2, 1fr)' width='95%' mt={8} mx={'auto'} gap={12}>
                <GridItem >
                    <Box bgColor={HONEY_DEW} rounded='2xl' p={6} height='100%' maxHeight='100%' minW='250px'>
                        <Heading size='md'>Current Queue</Heading>
                        <Divider/>
                        <Box py={4}>
							<div style={{ height: '500px', maxHeight: '600px', overflowY: 'auto' }}>
								{displayedQueue?.queue.length == 0 ? (
									<Center h='100%'>
										<VStack>
											<Text color={'gray.600'} textAlign='center' width="200px" size='sm'>No songs in the queue.</Text>
											<SecondaryButton onClick={() => location.href = `/jams/${code}/playlists`} text="Add songs from playlists"></SecondaryButton>
										</VStack>
									</Center>
								) : (
									<VStack maxHeight={'100%'} scrollBehavior='auto'>
										{displayedQueue?.queue.map((item, index) => (
											<Box w='100%' key={item.uri + '' + index}>
												<HStack>
													<Image src={item.album.images[0].url} w={50} alt={`${item.name} Image`} onClick={() => window.open(item.external_urls.spotify)}></Image>
													<VStack alignItems="flex-start">
														<Text textAlign={'left'} fontWeight={700}>{item.name}</Text>
														<Text>{reduceArtists(item.artists)}</Text>
													</VStack>
												</HStack>
											</Box>
										))}
									</VStack>
								)}
							</div>
						</Box>
                    </Box>
                </GridItem>
                <GridItem>
                    <Box bgColor={HONEY_DEW} rounded='2xl' p={6} height='100%' maxHeight='100%' minW='250px'>
                        <Heading size='md'>Request Queue</Heading>
                        <Divider/>
                        <Box py={4} h='100%'>
                        {displayedRequestQueue?.requests.length == 0 ? (
								<Center h='100%'>
									<VStack>
										<Text color={'gray.600'} textAlign='center' width="200px" size='sm'>No song requests yet.</Text>
										{
											// todo: make this button do something
										}
										<SecondaryButton text="Invite friends"></SecondaryButton>
									</VStack>
								</Center>
							) : (
								<div style={{ height: '500px', maxHeight: '600px', overflowY: 'auto' }}>
									<VStack maxHeight={'100%'} scrollBehavior='auto' minW='600px'>
										{displayedRequestQueue?.requests.map(item => (
											<Box w='100%' key={item.requestId.toString()}>
												<HStack justifyContent='space-between'>
													<HStack>
														<Image src={item.image} w={50} alt={`${item.name} Image`}></Image>
														<VStack alignItems="flex-start">
                                                                <Text textAlign={'left'} fontWeight={700}>{item.name}</Text>
                                                                <Text>{item.artists}</Text>
														</VStack>
													</HStack>
												</HStack>
											</Box>
										))}
									</VStack>
								</div>
							)}
                        </Box>
                    </Box>
                </GridItem>
            </Grid>
            {/* <HStack minW='100%' bgColor="whiteAlpha.400" p={4} bottom={0}>
                <Heading>
                    Currently Playing
                </Heading>
            </HStack> */}
        </PublicLayout>
    )

}

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
    const sessionCode = context?.params?.session;

    if (typeof sessionCode == "string") {
        const numberCode = Number(sessionCode);
        const queue = await getQueueFromCode(numberCode);
        const spotifyQueue = await getQueue(queue?.data?.hostId.toString());

        if (queue.status == Status.SUCCESS && queue.data && spotifyQueue != null) {
            const serialized = serialize(queue.data);
            return {
                props: {
                    code: numberCode,
                    queue: serialized,
                    spotifyQueue,
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