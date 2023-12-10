"use client";

import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Bars3Icon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { signOut } from "next-auth/react";
import useLog, { LogAction } from "@/services/hooks/useLog";

type NavbarMobileDropdownMenuProps = {
  isSignedIn: boolean;
  email?: string;
};
const NavbarMobileDropdownMenu = ({
  isSignedIn,
  email,
}: NavbarMobileDropdownMenuProps) => {
  const { log } = useLog();
  const [isDropdownMenuOpened, setIsDropdownMenuOpened] = React.useState(false);
  const onSignOutClick = async () => {
    log({
      action: LogAction.ButtonClicked,
      detail: "Sign out",
    });
    await signOut({ callbackUrl: "/signin" });
    setIsDropdownMenuOpened(false);
  };

  const onSignInClick = () => {
    log({
      action: LogAction.ButtonClicked,
      detail: "Sign in",
    });
    setIsDropdownMenuOpened(false);
  };

  const onMyApplicationClick = () => {
    log({
      action: LogAction.ButtonClicked,
      detail: "My application",
    });
    setIsDropdownMenuOpened(false);
  };

  return (
    <DropdownMenu
      open={isDropdownMenuOpened}
      onOpenChange={setIsDropdownMenuOpened}
    >
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost" aria-label="open menu">
          <Bars3Icon className="h-7 w-7" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[100vw]">
        {isSignedIn ? (
          <>
            <DropdownMenuLabel className="font-default">
              Signed in as {email}
            </DropdownMenuLabel>
            <DropdownMenuItem onClick={onMyApplicationClick}>
              <Link href="/application">My application</Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onSignOutClick}>
              Sign out
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuLabel>You are not signed in</DropdownMenuLabel>
            <DropdownMenuItem onClick={onSignInClick}>
              <Link href="/signin">Sign in</Link>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NavbarMobileDropdownMenu;
