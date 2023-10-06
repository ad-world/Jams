import { signOut, useSession } from "next-auth/react";
import { serialize } from "@/utils/util";
import Queue from "@/lib/models/queue.model";
import { Status } from "@/types/generic";
import { getServerSession, User } from "next-auth";
import { GetServerSidePropsContext } from "next";
import { authOptions } from "../api/auth/[...nextauth]";
import { getQueueByHostId } from "@/lib/queue";
import { getPlaylists, getQueue } from "@/lib/spotify";
import { getAccount, getAccountBySession } from "@/lib/account";
import {
	Box,
	Button,
	Center,
	Flex,
	Grid,
	GridItem,
	Heading,
	Highlight,
	HStack,
	Input,
	Menu,
	MenuButton,
	MenuDivider,
	MenuItem,
	MenuList,
	Text,
	VStack,
} from "@chakra-ui/react";
import Sidebar from "@/components/sidebar/Sidebar";
import { HONEY_DEW, LIGHT_BLUE, LIGHT_PURPLE } from "@/utils/colors";
import { requireAuth } from "@/utils/auth";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import { ArrowUpIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { QueueResponse } from "@/types/spotify"
import SecondaryButton from "@/components/buttons/SecondaryButton";

interface DashboardProps {
	spotifyQueue: QueueResponse | null;
	queue?: Queue | null;
	status: Status;
	message?: string;
	user: User | null
}

export default function Dashboard({ queue, user, spotifyQueue }: DashboardProps) {
	const emptyQueue = spotifyQueue?.queue.length === 0;
	return (
		<Box minH={"100vh"} minW={"100vw"}>
			<Flex minH={"100vh"}>
				<Box w="300px" p={8}>
					<VStack h='100%' justifyContent={'space-between'}>
						<div>
							<Heading size={"2xl"} mb={2}>
								Jams.
							</Heading>
							<Text mb={10}>
								<ArrowUpIcon color={'green'} /> Session is active
							</Text>
							<Sidebar />
						</div>
						<PrimaryButton text="Logout" onClick={() => signOut().then(() => location.href = "/")} />
					</VStack>
				</Box>
				{/* Main content */}
				<Box flex="1" bgColor={LIGHT_BLUE} >
					<HStack minW='100%' bgColor="whiteAlpha.400" p={4}>
						<Input maxW='40%' mx='auto' placeholder="Search for songs..." />
						<Menu>
							<MenuButton as={Button} rightIcon={<ChevronDownIcon/>}>
								Invite
							</MenuButton>
							<MenuList>
								<Heading m={3} size='sm'>Session Code: {queue?.sessionCode}</Heading>
								<MenuDivider></MenuDivider>
								<MenuItem>Copy session code to clipboard</MenuItem>
								<MenuItem>Copy session link to clipboard</MenuItem>
								<MenuDivider></MenuDivider>
								<MenuItem>Logout</MenuItem>
							</MenuList>
						</Menu>
					</HStack>
					<Grid templateColumns='repeat(4, 1fr)' height={'80%'} mt={16} gap={12} templateRows='repeat(2, 1fr)' width={'80%'} mx='auto'>
						<GridItem rowSpan={2}>
							<Box bgColor={HONEY_DEW} rounded="2xl" p={12} minW="250px" height="100%">
								<Heading size="md">Your Queue</Heading>
								{emptyQueue ? (
									<Center h='100%'>
										<VStack>
											<Text color={'gray.600'} textAlign='center' width="200px" size='sm'>No songs in the queue.</Text>
											<SecondaryButton onClick={() => location.href = "/dashboard/playlists"} text="Add songs from playlists"></SecondaryButton>
										</VStack>
									</Center>

								) : (
									<VStack maxHeight={'80%'}>
										songs
									</VStack>
								)}
								
							</Box>
						</GridItem>
						<GridItem colSpan={2} rowSpan={2} minW="250px">
							<Box bgColor={HONEY_DEW} rounded="2xl" p={12} minW="250px" height="100%">
								<Heading size="md">Song Requests</Heading>
							</Box>
						</GridItem>
						<GridItem>
							<Box bgColor={HONEY_DEW} rounded="2xl" p={12} minW="250px" height="100%">
								<Heading size="md">Currently Playing</Heading>

							</Box>
						</GridItem>
						<GridItem>
							<Box bgColor={HONEY_DEW} rounded="2xl" p={12} minW="250px" height="100%">
								<Heading size="md">Our Recommendations</Heading>

							</Box>
						</GridItem>
					</Grid>
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

	console.log(sub);
	// const account = await getAccount(sub);
	const spotifyQueue = await getQueue(sub);

	console.log(spotifyQueue);
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
