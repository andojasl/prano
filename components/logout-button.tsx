"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";

export function LogoutButton() {
  const router = useRouter();

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <Button onClick={logout}>
      <Image
        src="/icons/account.svg"
        alt="Logo"
        className="invert"
        width={24}
        height={24}
      />
      Logout
    </Button>
  );
}
