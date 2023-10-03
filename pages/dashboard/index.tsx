import { signOut, useSession } from "next-auth/react";
import { useSerialize } from "@/utils/hooks";
import Queue from "@/lib/models/queue.model";
import { Status } from "@/types/generic";
import { getServerSession, User } from "next-auth";
import { GetServerSidePropsContext } from "next";
import { authOptions } from "../api/auth/[...nextauth]";
import { getQueueByHostId } from "@/lib/queue";
import { getPlaylists } from "@/lib/spotify";
import { getAccount, getAccountBySession } from "@/lib/account";
import {
	Box,
	Button,
	Flex,
	Heading,
	VStack,
} from "@chakra-ui/react";
import Sidebar from "@/components/sidebar/Sidebar";
import { BG_PURPLE, MAIN_PURPLE } from "@/utils/colors";
import { requireAuth } from "@/utils/auth";

interface DashboardProps {
	queue?: Queue | null;
	status: Status;
	message?: string;
  user: User | null
}

export default function Dashboard({ queue, user }: DashboardProps) {
	return (
		<Box minH={"100vh"} minW={"100vw"}>
			<Flex minH={"100vh"}>
				<Box w="300px" p={8}>
          <VStack h='100%' justifyContent={'space-between'}>
            <div>
              <Heading size={"2xl"} mb={12}>
              Jams.
              </Heading>
              <Sidebar/> 
            </div>
            <Button bgColor={BG_PURPLE} color={'white'} _hover={{bgColor: MAIN_PURPLE}} onClick={() => signOut().then(() => location.href = "/")}>
              Logout
            </Button>
          </VStack>
				
				</Box>

				{/* Main content */}
				<Box flex="1" p={8} bgColor="purple.400">
					<Heading size="2xl">
						Hi {user?.name}, welcome to your jam!
					</Heading>
					{/* Main content goes here */}
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
	// const playlists = await getPlaylists(account?.providerAccountId, sub);
	const queue = await getQueueByHostId(sub);
	const serializedQueue = useSerialize(queue);
	// const serializedPlaylist = useSerialize(playlists);

	return {
		props: {
			queue: serializedQueue.data ?? null,
			status: serializedQueue.status ?? null,
			message: serializedQueue.message ?? null,
      user: session?.user ?? null
		},
	};
});
