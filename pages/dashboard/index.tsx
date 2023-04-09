/** @jsxImportSource theme-ui */
import { DashboardLayout } from "@/components/layouts/Dashboard";
import { Button } from "theme-ui";
import { signOut } from "next-auth/react";
import { useSerialize } from "@/utils/hooks";
import { consumeGenericResponse } from "@/utils/response";
import Queue from "@/lib/models/queue.model";
import { Status } from "@/types/generic";
import { getServerSession } from "next-auth";
import { GetServerSidePropsContext } from "next";
import { authOptions } from "../api/auth/[...nextauth]";
import { getQueueByHostId } from "@/lib/queue";
import { getPlaylists } from "@/lib/spotify";
import { getAccount, getAccountBySession } from "@/lib/account";
interface DashboardProps {
  queue?: Queue | null;
  status: Status;
  message?: string;
}

export default function Dashboard({ queue }: DashboardProps) {
  return (
    <DashboardLayout>
      Hello world!
      <Button
        variant="buttons.primary"
        onClick={() => signOut({ callbackUrl: "/" })}
      >
        Log Out
      </Button>
    </DashboardLayout>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);
  const sub = session?.user.id;

  const account = await getAccount(sub);
  const playlists = await getPlaylists(account?.providerAccountId, sub);
  const queue = await getQueueByHostId(sub);
  const serializedQueue = useSerialize(queue);
  const serializedPlaylist = useSerialize(playlists);

  return {
    props: {
      queue: serializedQueue.data ?? null,
      status: serializedQueue.status ?? null,
      message: serializedQueue.message ?? null,
    },
  };
}
