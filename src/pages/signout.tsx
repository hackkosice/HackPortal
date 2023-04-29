import { signOut, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Page() {
  const { data: session } = useSession();
  const { push } = useRouter();
  useEffect(() => {
    if (session) {
      signOut();
    }
    push("/");
  }, [push, session]);
  return <p>Signing out</p>;
}
