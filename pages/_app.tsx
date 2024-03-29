import "@/styles/globals.scss";
import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { SessionProvider } from "next-auth/react";
import { trpc } from "@/utils/trpc"

const App = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) => {
  return (
    <SessionProvider session={session}>
      <ChakraProvider>
          <Component {...pageProps} />
      </ChakraProvider>
    </SessionProvider>
  );
}

export default trpc.withTRPC(App);