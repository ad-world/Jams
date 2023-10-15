/* eslint-disable react/no-unescaped-entities */
import { signOut } from "next-auth/react";
import { serialize } from "@/utils/util";
import Queue from "@/lib/models/queue.model";
import { Status } from "@/types/generic";
import { getServerSession, User } from "next-auth";
import { getQueueByHostId } from "@/lib/queue";
import { getQueue } from "@/lib/spotify";
import {
	Box,
	Button,
	Center,
	Flex,
	Grid,
	GridItem,
	Heading,
	Menu,
	Image,
	MenuButton,
	MenuDivider,
	MenuItem,
	MenuList,
	Text,
	VStack,
	HStack,
	Divider,
	useToast,
} from "@chakra-ui/react";
import Sidebar from "@/components/sidebar/Sidebar";
import { HONEY_DEW, LIGHT_BLUE, LIGHT_PURPLE } from "@/utils/colors";
import { requireAuth } from "@/utils/auth";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import { ArrowUpIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { QueueResponse, SingleTransformedSearchResponse } from "@/types/spotify"
import SecondaryButton from "@/components/buttons/SecondaryButton";
import { trpc } from "@/utils/trpc";
import { authOptions } from "../api/auth/[...nextauth]";
import SongSearch from "@/components/search/SongSearch";
import { reduceArtists } from "@/utils/util";
import { ButtonHTMLAttributes, useEffect, useRef, useState } from "react";
import io from 'socket.io-client'
import type { Socket } from 'socket.io-client'
import { UpdateQueueEvent } from "@/types/socket";
import { AddSongRequest } from "@/types/requsts";
import SessionLayout from "@/components/layouts/SessionLayout";


let socket: Socket;

interface DashboardProps {
	spotifyQueue: QueueResponse | null;
	queue: Queue | null;
	status: Status;
	message?: string;
	user: User | null
}

export default function Dashboard({ queue, user, spotifyQueue }: DashboardProps) {
	const { data: spotifyQueueData, refetch: refetchSpotifyQueue } = trpc.getQueue.useQuery({ userId: user?.id ?? '' });
	const { data: requestQueueData, refetch: refetchQueueData } = trpc.getJamQueue.useQuery({ queueId: queue?.queueId.toString() ?? '' });
	const response = trpc.logout.useMutation()
	const addSongToQueue = trpc.acceptSong.useMutation();
	const deleteRequestFromQueue = trpc.deleteRequestFromQueue.useMutation();

	const inviteFriendsRef = useRef<HTMLButtonElement>();
	const [displayedQueue, setDisplayedQueue] = useState<QueueResponse | null>(spotifyQueue);
	const [displayedRequestQueue, setDisplayedRequestQueue] = useState<Queue | null>(queue);
	const emptyQueue = displayedQueue?.queue?.length === 0;
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


	const logout = (hostId: string) => {
		response.mutate({ hostId });
		signOut().then(() => location.href = "/");
	}

	const chooseSong = async (track: SingleTransformedSearchResponse) => {
		await addSongToQueue.mutateAsync({ userId: user?.id ?? '', songUri: track.uri });
		refetchSpotifyQueue();
	}

	const acceptSongFromRequest = async (song: Omit<AddSongRequest, "queueId">) => {
		await addSongToQueue.mutateAsync({ userId: user?.id ?? '', songUri: song.uri });
		await deleteRequestFromQueue.mutateAsync({ queueId: queue?.queueId.toString() ?? '', requestId: song.requestId.toString() })
		refetchQueueData();
		refetchSpotifyQueue();
	}

	useEffect(() => {
		setDisplayedQueue(spotifyQueueData ?? null);
	}, [spotifyQueueData])

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
		const socketInitializer = async () => {
			fetch('/api/socket').finally(() => {
				socket = io()

				socket.on('connect', () => {
                    console.log('Connected to websocket server');
				})

				socket.on('reload-queue', (data: UpdateQueueEvent) => {
					if (data.queueId === queue?.queueId.toString()) {
						refetchQueueData();
					}
				});
			})
		}

		socketInitializer();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
		<SessionLayout user={user}>
			<HStack minW='100%' bgColor="whiteAlpha.400" p={4} >
				<SongSearch userId={user?.id ?? ''} mx='auto' onChoose={chooseSong} />
				<Menu >
					<MenuButton ref={inviteFriendsRef} as={Button} rightIcon={<ChevronDownIcon />}>
						Invite
					</MenuButton>
					<MenuList>
						<Heading m={3} size='sm'>Session Code: {queue?.sessionCode}</Heading>
						<MenuDivider></MenuDivider>
						<MenuItem onClick={async () => await copyCodeToClipboard(queue?.sessionCode)}>Copy session code to clipboard</MenuItem>
						<MenuItem onClick={async () => await copyLinkToClipboard(queue?.sessionCode)}>Copy session link to clipboard</MenuItem>
						<MenuDivider></MenuDivider>
						<MenuItem onClick={() => logout(user?.id ?? '')}>Logout</MenuItem>
					</MenuList>
				</Menu>
			</HStack>
			<Grid templateColumns='repeat(4, 1fr)' height={'80%'} mt={16} gap={12} templateRows='repeat(2, 1fr)' width={'80%'} mx='auto'>
				<GridItem rowSpan={2}>
					<Box bgColor={HONEY_DEW} rounded="2xl" p={6} minW="250px" height="100%" maxHeight='100%'>
						<Heading size="md">Your Queue</Heading>
						<Divider />
						<Box py={4}>
							<div style={{ height: '600px', maxHeight: '600px', overflowY: 'auto' }}>
								{emptyQueue ? (
									<Center h='100%'>
										<VStack>
											<Text color={'gray.600'} textAlign='center' width="200px" size='sm'>No songs in the queue.</Text>
											<SecondaryButton onClick={() => location.href = "/dashboard/playlists"} text="Add songs from playlists"></SecondaryButton>
										</VStack>
									</Center>
								) : (
									<VStack maxHeight={'100%'} scrollBehavior='auto'>
										{displayedQueue?.queue.map((item, index) => (
											<Box w='100%' key={item.uri + '' + index}>
												<HStack>
													<Image src={item.album.images[0].url} w={50} alt={`${item.name} Image`}></Image>
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
				<GridItem colSpan={2} rowSpan={2} minW="250px">
					<Box bgColor={HONEY_DEW} rounded="2xl" p={6} minW="250px" height="100%">
						<Heading size="md">Song Requests</Heading>
						<Divider />
						<Box py={4} h='100%'>
							{displayedRequestQueue?.requests?.length == 0 ? (
								<Center h='100%'>
									<VStack>
										<Text color={'gray.600'} textAlign='center' width="200px" size='sm'>No song requests yet.</Text>
										<SecondaryButton text="Invite friends" onClick={() => inviteFriendsRef?.current?.click()}></SecondaryButton>
									</VStack>
								</Center>
							) : (
								<div style={{ height: '600px', maxHeight: '600px', overflowY: 'auto' }}>
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
													<HStack gap={4} mr={2}>
														<Button variant={'outline'} colorScheme="green" onClick={() => {
															acceptSongFromRequest(item)
															socket?.emit('refresh-jam', { queueId: queue?.queueId })
														}}>Accept</Button>
														<Button
															variant={'outline'}
															colorScheme="red"
															onClick={() => {
																deleteRequestFromQueue.mutateAsync({
																queueId: queue?.queueId.toString() ?? '',
																requestId: item.requestId.toString()
															})
															socket?.emit('refresh-jam', { queueId: queue?.queueId })}}
														>
															Reject
														</Button>
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
				<GridItem>
					<Box bgColor={HONEY_DEW} rounded="2xl" p={6} minW="250px" height="100%">
						<Heading size="md" textAlign={'center'}>Currently Playing</Heading>
						<Center w='full' h='full'>
							{displayedQueue?.currently_playing == null ? (
								<Text>Nothing is playing at the moment.</Text>
							) : (
								<VStack>
									<Image src={displayedQueue.currently_playing.album.images[0].url} h='200' rounded={'xl'} alt={`${displayedQueue.currently_playing.name}-image`} />
									<Heading size='sm'>{displayedQueue.currently_playing.name}</Heading>
									<Text>{reduceArtists(displayedQueue.currently_playing.artists)}</Text>
								</VStack>
							)}
						</Center>
					</Box>
				</GridItem>
				<GridItem>
					<Box bgColor={HONEY_DEW} rounded="2xl" p={6} minW="250px" height="100%">
						<Heading size="md">Our Recommendations</Heading>
						<Divider />
						<Center h='100%'>
							Do not look here yet I'm working on it
						</Center>
					</Box>
				</GridItem>
			</Grid>
		</SessionLayout>
	);
}

export const getServerSideProps = requireAuth(async (context) => {
	const session = await getServerSession(
		context.req,
		context.res,
		authOptions
	);

	const sub = session?.user.id;

	// const account = await getAccount(sub);
	const spotifyQueue = await getQueue(sub);

	// const playlists = await getPlaylists(account?.providerAccountId, sub);
	const queue = await getQueueByHostId(sub);
	const serializedQueue = serialize(queue);
	// const serializedPlaylist = useSerialize(playlists);

	return {
		props: {
			queue: serializedQueue.data ?? null,
			status: serializedQueue.status ?? null,
			message: serializedQueue.message ?? null,
			user: session?.user ?? null,
			spotifyQueue: spotifyQueue
		},
	};
});
