import { useSession, signIn, signOut } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();
  const isSignedIn = session ? true : false;
  return (
    <>
        Hello World
    </>
  );
}
