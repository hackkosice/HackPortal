import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Heading } from "./Heading";
import { useBreakpoints } from "../services/hooks/useBreakpoints";
import { signOut, useSession } from "next-auth/react";
import { Stack } from "../components/Stack";
import { Button } from "../components/Button";
const Navbar = () => {
  const { isMedium } = useBreakpoints();
  const { data: session } = useSession();
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
        <Stack direction="row">
          <Button label="Sign out" size="small" onClick={signOut} />
        </Stack>
      ) : (
        <Button type="buttonLink" href={"/login"} label="Log in" />
      )}
    </nav>
  );
};
export default Navbar;
