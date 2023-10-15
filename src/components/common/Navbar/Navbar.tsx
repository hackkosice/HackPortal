"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useBreakpoints } from "@/services/hooks/useBreakpoints";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import clearLocalApplicationData from "@/services/helpers/localData/clearLocalApplicationData";
import { usePathname } from "next/navigation";
const Navbar = () => {
  const pathname = usePathname();
  const { isMedium } = useBreakpoints();
  const { data: session } = useSession();
  const onSignOutClick = () => {
    clearLocalApplicationData();
    signOut({ callbackUrl: "/signin" });
  };
  const isSignInPage = pathname === "/signin";
  return (
    <nav className="fixed flex flex-row bg-hkLightGray w-full m-0 py-3 px-3 border-b-2 border-hkGray content-center md:py-6 md:px-5">
      <Link href={"/"} className="flex content-center">
        <Image
          src="/hk-logo.svg"
          alt="Hack Kosice logo"
          width={isMedium ? "200" : "150"}
          height="200"
          className="ml-2"
        />
      </Link>
      <div className="mx-5 bg-gray-300 w-0.5"></div>
      <Heading size="small">Application portal</Heading>
      <div className="flex-grow"></div>
      {session ? (
        <Button size="small" onClick={onSignOutClick}>
          Sign out
        </Button>
      ) : (
        !isSignInPage && (
          <Button asChild>
            <Link href="/signin">Sign in</Link>
          </Button>
        )
      )}
    </nav>
  );
};
export default Navbar;
