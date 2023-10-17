import { Roboto, League_Spartan } from "next/font/google";
import "@/styles/globals.css";
import TrpcProvider from "@/components/context/TrpcProvider";
import NextAuthProvider from "@/components/context/NextAuthProvider";
import NavbarApp from "@/components/common/Navbar/NavbarApp";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const roboto = Roboto({
  variable: "--font-roboto",
  weight: ["400", "700"],
  subsets: ["latin"],
});

const leagueSpartan = League_Spartan({
  variable: "--font-league-spartan",
  weight: ["400", "700"],
  subsets: ["latin"],
});

export default async function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  return (
    <html lang="en" className={`${roboto.variable} ${leagueSpartan.variable}`}>
      <body>
        <TrpcProvider>
          <NextAuthProvider>
            <main className={`font-default bg-hkLightGray relative`}>
              <NavbarApp session={session} />
              <div className="grid items-center justify-center h-full min-h-screen">
                {children}
              </div>
            </main>
          </NextAuthProvider>
        </TrpcProvider>
      </body>
    </html>
  );
}
