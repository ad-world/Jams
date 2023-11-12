import { Box, Flex, VStack, Heading, Text, ContainerProps, BoxProps } from "@chakra-ui/react";
import { ArrowUpIcon } from "@chakra-ui/icons";
import Sidebar from "../sidebar/Sidebar";
import PrimaryButton from "../buttons/PrimaryButton";
import { LIGHT_BLUE } from "@/utils/colors";
import { trpc } from "@/utils/trpc";
import { signOut } from "next-auth/react";
import { User } from "next-auth";
import Head from "next/head";

interface SessionLayoutProps extends BoxProps {
    children: React.ReactNode
    user: User | null
}

const SessionLayout: React.FC<SessionLayoutProps> = ({ children, user, ...props }) => {
    const response = trpc.logout.useMutation()
    const logout = (hostId: string) => {
		response.mutate({ hostId });
		signOut().then(() => location.href = "/");
	}

    return (
		<>
			<Head>
				<title>Jams</title>
				<meta property="og:title" content={`${user?.name}'s Jam`} key="title"/>
				<meta name="description" content={`Join ${user?.name}'s Jam`}></meta>
				<meta name="author" content="Aryaman Dhingra"></meta>
			</Head>
			<Box minH={"100vh"} minW={"100vw"} maxH="100vh">
				<Flex minH={"100vh"} maxH="100vh">
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
							<PrimaryButton text="Logout" onClick={() => logout(user?.id ?? '')}
							/>
						</VStack>
					</Box>
					{/* Main content */}
					<Box flex="1" bgColor={LIGHT_BLUE} {...props}>
						{children}
					</Box>
				</Flex>
			</Box>
		</>
    )
}

export default SessionLayout;