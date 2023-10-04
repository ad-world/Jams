import { LIGHT_BLUE, MEDIUM_BLUE } from "@/utils/colors";
import { Box, Button, Center, Heading } from "@chakra-ui/react";
import { signIn } from "next-auth/react";

export default function Home() {
  return (

    <Center minH='100vh' minW='100vw' bgColor={LIGHT_BLUE}>
      <Box bgColor={"white"} borderRadius="2xl" p={20}>
        <Heading size={'3xl'} mb={4}>Jams.</Heading>
        <Button 
          bgColor={MEDIUM_BLUE}
          onClick={() => signIn("spotify", { callbackUrl: "/dashboard" })}
        >
          Login with Spotify
        </Button>
      </Box>
    </Center>
  );
}
