"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import useLog, { LogAction } from "@/services/hooks/useLog";

const NavbarLogo = () => {
  const { log } = useLog();
  return (
    <Link
      href={"/"}
      onClick={() => {
        log({
          action: LogAction.ButtonClicked,
          detail: "Navbar logo",
        });
      }}
    >
      <div className="w-[120px] h-[60px] md:w-[200px] relative">
        <Image fill src="/hk-logo.svg" alt="Hack Kosice logo" />
      </div>
    </Link>
  );
};

export default NavbarLogo;
