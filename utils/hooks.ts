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

export function useSerialize<T>(data: T): T {
  console.log(data);
  return JSON.parse(JSON.stringify(data));
}
