import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export const useRedirectSession = () => {
  const session = useSession();
  const router = useRouter();

  if (session.status === "unauthenticated") {
    router.push("/");
  }

  return session;
};
