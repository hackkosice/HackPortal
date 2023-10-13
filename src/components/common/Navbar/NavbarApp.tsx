import React from "react";
import { Heading } from "../../Heading";
import { Button } from "@/components/ui/button";
import NavbarLogo from "@/components/common/Navbar/components/NavbarLogo";
import { Session } from "next-auth";
import SignoutButton from "@/components/common/Navbar/components/SignoutButton";
import Link from "next/link";
const NavbarApp = ({ session }: { session: Session | null }) => {
  return (
    <nav className="fixed flex flex-row bg-hkLightGray w-full m-0 py-3 px-3 border-b-2 border-hkGray content-center md:py-6 md:px-5">
      <NavbarLogo />
      <div className="mx-5 bg-gray-300 w-0.5"></div>
      <Heading size="small">Application portal</Heading>
      <div className="flex-grow"></div>
      {session ? (
        <SignoutButton />
      ) : (
        <Button asChild>
          <Link href="/signin">Sign in</Link>
        </Button>
      )}
    </nav>
  );
};
export default NavbarApp;
