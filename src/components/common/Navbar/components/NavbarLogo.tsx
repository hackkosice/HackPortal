"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

const NavbarLogo = () => {
  return (
    <Link href={"/"}>
      <div className="w-[120px] h-[60px] md:w-[200px] relative">
        <Image fill src="/hk-logo.svg" alt="Hack Kosice logo" />
      </div>
    </Link>
  );
};

export default NavbarLogo;
