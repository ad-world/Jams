/** @jsxImportSource theme-ui */
import { DashboardLayout } from "@/components/layouts/Dashboard";
import { Button } from "theme-ui";
import { signOut } from "next-auth/react";
import { useRedirectSession } from "@/utils/hooks";

export default function Dashboard() {
  const session = useRedirectSession();
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
