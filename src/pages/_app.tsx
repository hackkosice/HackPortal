import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Roboto, League_Spartan } from "next/font/google";
import Navbar from "@/components/Navbar";

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

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main
      className={`${roboto.variable} ${leagueSpartan.variable} font-default bg-hkLightGray min-h-screen`}
    >
      <Navbar />
      <Component {...pageProps} />
    </main>
  );
}
