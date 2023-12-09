import React from "react";
import Link from "next/link";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import NavbarLogo from "@/components/common/Navbar/components/NavbarLogo";
import SignoutButton from "@/components/common/Navbar/components/SignoutButton";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Stack } from "@/components/ui/stack";
import { Text } from "@/components/ui/text";
import NavbarMobileDropdownMenu from "@/components/common/Navbar/components/NavbarMobileDropdownMenu";
const Navbar = async () => {
  const session = await getServerSession(authOptions);

  return (
    <nav className="z-50 justify-between h-navbarHeightMobile md:h-navbarHeight gap-2 fixed flex flex-row bg-hkLightGray w-full m-0 py-3 px-3 border-b-2 border-hkGray items-center md:py-6 md:px-5">
      <div className="flex flex-row items-center md:gap-2">
        <NavbarLogo />
        <div className="mx-3 md:mx-5 bg-gray-300 w-0.5 h-[40px]"></div>
        <Heading size="small">Application portal</Heading>
      </div>
      <div className="md:hidden">
        <NavbarMobileDropdownMenu
          isSignedIn={Boolean(session)}
          email={session?.user?.email ?? undefined}
        />
      </div>
      <div className="hidden md:block">
        {session ? (
          <Stack direction="row" alignItems="center">
            <Text>
              Signed in as <b>{session?.user?.email}</b>
            </Text>
            <SignoutButton />
          </Stack>
        ) : (
          <Button asChild>
            <Link href="/signin">Sign in</Link>
          </Button>
        )}
      </div>
    </nav>
  );
};
export default Navbar;
