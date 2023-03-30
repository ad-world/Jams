/** @jsxImportSource theme-ui */
import { Container } from "theme-ui";
import { Button, Heading } from "theme-ui";
import { useSession, signIn, signOut } from "next-auth/react";
import { Landing } from "@/components/layouts/Landing";

export default function Home() {
  const { data: session } = useSession();
  const isSignedIn = session ? true : false;
  return (
    <>
      <Landing>
        <Container sx={{ width: "50%" }}>
          <Heading mb={4}>Jams</Heading>
          <Container
            p={4}
            sx={{
              backgroundColor: "white",
              borderRadius: "25px",
            }}
            bg="muted"
          >
            {!isSignedIn ? (
              <Button
                variant="buttons.primary"
                onClick={() => signIn("spotify", { callbackUrl: "/dashboard" })}
              >
                Log In with Spotify
              </Button>
            ) : (
              <>
                <Heading>{session?.user?.name}</Heading>
                <Heading>{session?.user?.email}</Heading>
                <Button variant="buttons.primary" onClick={() => signOut()}>
                  Log Out
                </Button>
              </>
            )}
          </Container>
        </Container>
      </Landing>
    </>
  );
}
