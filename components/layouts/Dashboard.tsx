/** @jsxImportSource theme-ui */

import { ReactNode } from "react";
import Image from "next/image";
import Icon from "../../public/Musically.svg";
import { VStack, Grid, GridItem, Container } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { Heading } from "theme-ui";
import Head from "next/head";

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
}) => {
  const session = useSession();

  return (
    <>
      <Head>
        <title>Jams</title>
        <meta name="description" content="Jams" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/Musically.svg" />
      </Head>
      <div sx={{ variant: "layout.root" }}>
        <header sx={{ variant: "layout.header" }}>
          <Image src={Icon} alt="ICON" />
        </header>
        <main sx={{ width: "100%" }}>
          <Grid templateColumns="repeat(4, 1fr)" width={"100%"}>
            <GridItem rowSpan={1}>
              <VStack gap={2} p={40}>
                <Image
                  loader={() => session?.data?.user?.image ?? ""}
                  src={session?.data?.user?.image ?? ""}
                  alt="Spotify Profile Picture"
                  width={200}
                  height={200}
                  sx={{ borderRadius: "20px" }}
                ></Image>
                <Heading>{session?.data?.user?.name ?? ""}</Heading>
              </VStack>
            </GridItem>
            <GridItem rowSpan={3}>
              <Container backgroundColor="white" borderRadius="25px">
                {children}
              </Container>
            </GridItem>
          </Grid>
        </main>
      </div>
    </>
  );
};
