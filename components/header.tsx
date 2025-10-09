"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CartSheet } from "./cartSheet";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();

    // Get initial user
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };

    getUser();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Close menu on route changes
  useEffect(() => {
    const handleRouteChange = () => {
      setMenuOpen(false);
    };

    // Listen for route changes
    const originalPush = router.push;
    const originalReplace = router.replace;

    router.push = (...args) => {
      handleRouteChange();
      return originalPush.apply(router, args);
    };

    router.replace = (...args) => {
      handleRouteChange();
      return originalReplace.apply(router, args);
    };

    // Clean up by restoring original methods
    return () => {
      router.push = originalPush;
      router.replace = originalReplace;
    };
  }, [router]);

  return (
    <header
      className={`w-full fixed top-0 ${menuOpen ? "bg-white" : "bg-white/80 backdrop-blur-md"} px-4 md:px-16 pt-8 pb-6 flex flex-col gap-2 z-50`}
      style={{ boxShadow: "0 4px 32px rgba(0,0,0,0.04)" }}
    >
      <div className="flex items-center justify-between w-full">
        {/* Desktop Nav */}
        <nav className="hidden lg:flex gap-10 items-center">
          <Link
            href="/shop"
            className="text-base text-black font-serif hover:text-gray-600 transition-colors"
          >
            SHOP
          </Link>
          <Link
            href="/custom-order"
            className="text-base text-black font-serif hover:text-gray-600 transition-colors"
          >
            CUSTOM ORDER
          </Link>
        </nav>
        {/* Logo */}
        <div className="flex items-center absolute left-1/2 -translate-x-1/2 justify-center">
          <Link href="/">
            <Image
              src="/icons/logo-prano.svg"
              alt="Logo"
              width={40}
              height={56}
            />
          </Link>
        </div>
        {/* Desktop Right */}
        <div className="hidden lg:flex gap-10 text-black items-center">
          {user && (
            <Link href="/dashboard" className="text-base font-serif">
              DASHBOARD
            </Link>
          )}
          <a className="text-base font-serif" href="/about">
            ABOUT
          </a>
          <div className="flex items-center gap-2">
            <CartSheet />
          </div>
        </div>
        {/* Hamburger for mobile */}
        <button
          className="lg:hidden flex flex-col justify-center items-center w-10 h-10"
          aria-label="Open menu"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className="block w-6 h-0.5 bg-black mb-1"></span>
          <span className="block w-6 h-0.5 bg-black mb-1"></span>
          <span className="block w-6 h-0.5 bg-black"></span>
        </button>
        <div className="lg:hidden">
          <CartSheet />
        </div>
      </div>
      {/* Mobile Menu */}
      {menuOpen && (
        <nav className="lg:hidden h-screen pt-48 w-screen relative -mx-4 -md:mx-16 -sm:mx-14  flex flex-col px-4 gap-4 bg-white ">
          <Link
            href="/shop"
            className="text-lg font-serif"
            onClick={() => setMenuOpen(false)}
          >
            SHOP
          </Link>
          <a
            className="text-lg font-serif"
            href="/custom-order"
            onClick={() => setMenuOpen(false)}
          >
            CUSTOM ORDER
          </a>
          <a
            className="text-lg font-serif"
            href="/about"
            onClick={() => setMenuOpen(false)}
          >
            ABOUT
          </a>
          {user && (
            <Link href="/dashboard" className="text-lg font-serif" onClick={() => setMenuOpen(false)}>
              DASHBOARD
            </Link>
          )}
        </nav>
      )}
    </header>
  );
}
