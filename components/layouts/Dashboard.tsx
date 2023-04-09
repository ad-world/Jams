/** @jsxImportSource theme-ui */

import { ReactNode } from "react";
import Image from "next/image";
import Icon from "../../public/Musically.svg";
import { VStack, Grid, GridItem, Container, HStack } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { Heading, Spinner } from "theme-ui";
import Head from "next/head";
import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

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
          <Grid templateColumns="repeat(5, 1fr)" width={"100%"}>
            <GridItem colSpan={1}>
              <VStack gap={2} p={40}>
                {session.status === "loading" ? (
                  <Spinner size={100} />
                ) : (
                  <HStack gap="30px">
                    <Image
                      loader={() => session?.data?.user?.image ?? ""}
                      src={session?.data?.user?.image ?? ""}
                      alt="Spotify Profile Picture"
                      width={100}
                      height={100}
                      sx={{ borderRadius: "20px" }}
                    ></Image>
                    <VStack alignItems="left">
                      <h3 sx={{ variant: "text.subheading", color: "white" }}>
                        Host
                      </h3>
                      <h4 sx={{ variant: "text.heading", color: "white" }}>
                        {session.data?.user.name}
                      </h4>
                    </VStack>
                  </HStack>
                )}
              </VStack>
            </GridItem>
            <GridItem colSpan={4} p={40}>
              <Container backgroundColor="white" borderRadius="25px" p={20}>
                {children}
              </Container>
            </GridItem>
          </Grid>
        </main>
      </div>
    </>
  );
};
