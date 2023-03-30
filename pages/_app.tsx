import "@/styles/globals.scss";
import { ThemeProvider } from "@theme-ui/core";
import type { AppProps } from "next/app";
import type { Theme } from "theme-ui";
import { ChakraProvider } from "@chakra-ui/react";
import { SessionProvider } from "next-auth/react";

const theme: Theme = {
  fonts: {
    body: "system-ui, sans-serif",
    heading: '"system-ui", sans-serif',
    monospace: "Menlo, monospace",
  },
  layout: {
    root: {
      backgroundImage: "linear-gradient(to bottom, #3A389F , #9024E4);",
      display: "flex",
      minHeight: "100vh",
      width: "100%",
      flexDirection: "column",
    },
    header: {
      padding: "20px",
    },
  },
  buttons: {
    primary: {
      backgroundImage: "linear-gradient(to left, #3A389F , #9024E4);",
      padding: "10px",
      borderRadius: "10px",
      color: "white",
      marginLeft: "2px",
      marginRight: "2px",
      fontWeight: "600",
    },
  },
  text: {
    heading: {
      fontWeight: "600",
      fontSize: "36px",
    },
  },
};

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <ChakraProvider>
        <ThemeProvider theme={theme}>
          <Component {...pageProps} />
        </ThemeProvider>
      </ChakraProvider>
    </SessionProvider>
  );
}
