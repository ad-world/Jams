import PrimaryButton from "@/components/buttons/PrimaryButton";
import SecondaryButton from "@/components/buttons/SecondaryButton";
import { LIGHT_BLUE } from "@/utils/colors";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { Box, Center, FormControl, FormLabel, Heading, HStack, Input, Text, useToast, VStack } from "@chakra-ui/react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Head from "next/head";

export default function Home() {
	const [isJoiningSession, setIsJoiningSession] = useState<boolean>(false);
	const [sessionCode, setSessionCode] = useState<string>('');
	const params = useSearchParams();
	const toast = useToast();

	useEffect(() => {
		if (params.get('error')) {
			toast({
				title: 'Error',
				description: 'You must have a premium account to use this service.',
				colorScheme: 'red',
				variant: 'solid',
				isClosable: true,
				position: 'top'
			})
		}
	}, [params, toast])


	const joinSession = (sessionCode: string) => location.href = `/jams/${sessionCode}`;

	return (
		<>
			<Head>
				<title>Jams</title>
				<meta property="og:title" content="Welcome to Jams" key="title" />
				<meta name="description" content="A platform for creating collaborative queue's with easen"></meta>
				<meta name="author" content="Aryaman Dhingra"></meta>
			</Head>
			<Center minH='100vh' minW='100vw' bgColor={LIGHT_BLUE}>
				<Box bgColor={"white"} borderRadius="2xl" p={20}>
					<Heading size={'3xl'} mb={4}>Jams.</Heading>
					<VStack>
						{!isJoiningSession && (<><PrimaryButton
							text="Login with Spotify"
							onClick={() => signIn("spotify", { callbackUrl: "/dashboard" })}
						/>
							<SecondaryButton text="Join a Session" onClick={() => setIsJoiningSession(true)} />
						</>)}
						{isJoiningSession &&
							<>
								<FormControl>
									<FormLabel>Session Code</FormLabel>
									<Input value={sessionCode} onChange={(e) => setSessionCode(e.target.value)}></Input>
									<PrimaryButton text="Join Session" mt={4} onClick={() => joinSession(sessionCode)}></PrimaryButton>
								</FormControl>
								<HStack>
									<ArrowBackIcon></ArrowBackIcon>
									<Text _hover={{ textDecoration: 'underline', cursor: 'pointer' }} onClick={() => setIsJoiningSession(false)}>Go back</Text>
								</HStack>
							</>}
					</VStack>
				</Box>
			</Center>
		</>
	);
}
