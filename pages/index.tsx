import PrimaryButton from "@/components/buttons/PrimaryButton";
import SecondaryButton from "@/components/buttons/SecondaryButton";
import { LIGHT_BLUE } from "@/utils/colors";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { Box, Center, FormControl, FormLabel, Heading, HStack, Input, Text, VStack } from "@chakra-ui/react";
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function Home() {
  const [isJoiningSession, setIsJoiningSession] = useState<boolean>(false);
  const [sessionCode, setSessionCode] = useState<string>('');

  const joinSession = (sessionCode: string) => location.href = `/jams/${sessionCode}`;

  return (
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
              <Text _hover={{ textDecoration: 'underline', cursor: 'pointer'}} onClick={() => setIsJoiningSession(false)}>Go back</Text>
            </HStack>
          </>}
        </VStack>
      </Box>
    </Center>
  );
}
