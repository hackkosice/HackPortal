import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Roboto, League_Spartan } from "next/font/google";
import Navbar from "@/components/Navbar";
import { SessionProvider } from "next-auth/react";
import { trpc } from "@/services/trpc";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const roboto = Roboto({
  variable: "--font-roboto",
  weight: "400",
  subsets: ["latin"],
});

const leagueSpartan = League_Spartan({
  variable: "--font-league-spartan",
  weight: ["400", "700"],
  subsets: ["latin"],
});

function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <main
        className={`${roboto.variable} ${leagueSpartan.variable} font-default bg-hkLightGray relative`}
      >
        <Navbar />
        <div className="grid items-center justify-center h-full min-h-screen">
          <Component {...pageProps} />
        </div>
        <ReactQueryDevtools initialIsOpen={false} />
      </main>
    </SessionProvider>
  );
}

export default trpc.withTRPC(App);
