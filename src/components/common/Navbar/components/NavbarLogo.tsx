"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useBreakpoints } from "@/services/hooks/useBreakpoints";

const NavbarLogo = () => {
  const { isMedium } = useBreakpoints();
  return (
    <Link href={"/"} className="flex content-center">
      <Image
        src="/hk-logo.svg"
        alt="Hack Kosice logo"
        width={isMedium ? "200" : "150"}
        height="200"
        className="ml-2"
      />
    </Link>
  );
};

export default NavbarLogo;
