/** @jsxImportSource theme-ui */

import { ReactNode } from "react";
import Image from "next/image";
import Icon from "../../public/Musically.svg";
import Head from "next/head";

interface LandingProps {
  children: ReactNode;
}

export const Landing: React.FC<LandingProps> = ({ children }) => {
  return (
    <>
      <Head>
        <title>Jams</title>
        <meta name="description" content="Jams" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/Musically.svg" />
      </Head>
      <div
        sx={{
          variant: "layout.root",
        }}
      >
        <header
          sx={{
            variant: "layout.header",
          }}
        >
          <Image src={Icon} alt="ICON" />
        </header>
        <main
          sx={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
          }}
        >
          {children}
        </main>
      </div>
    </>
  );
};
