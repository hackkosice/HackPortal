import { Roboto, League_Spartan } from "next/font/google";
import "@/styles/globals.css";
import NextAuthProvider from "@/components/context/NextAuthProvider";
import Navbar from "@/components/common/Navbar/Navbar";
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import SetDatadogUser from "@/components/common/DatadogInit/SetDatadogUser";
import CookieConsentDialog from "@/components/common/CookieConsentDialog";

const roboto = Roboto({
  variable: "--font-roboto",
  weight: ["400", "700"],
  subsets: ["latin"],
});

const leagueSpartan = League_Spartan({
  variable: "--font-league-spartan",
  weight: ["400", "600", "700"],
  subsets: ["latin"],
});

export default async function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${roboto.variable} ${leagueSpartan.variable}`}>
      <body>
        <CookieConsentDialog>
          <NextAuthProvider>
            <SetDatadogUser />
            <main className={`font-default bg-hkLightGray relative`}>
              <Navbar />
              <div className="flex min-h-screen px-2 md:px-5">{children}</div>
            </main>
            <Toaster />
          </NextAuthProvider>
        </CookieConsentDialog>
      </body>
    </html>
  );
}
