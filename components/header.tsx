"use client"
import Image from "next/image";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import Link from "next/link";
import { CartSheet } from "./cartSheet";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    // Get initial user
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    getUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return (
    <header className="w-full fixed top-0 bg-white/90 backdrop-blur-md px-4 md:px-16 sm:px-14 pt-8 pb-6 flex flex-col gap-2 z-50" style={{ boxShadow: '0 4px 32px rgba(0,0,0,0.04)' }}>
      <div className="flex items-center justify-between w-full">
        {/* Desktop Nav */}
        <nav className="hidden sm:flex gap-10 items-center">
          <Link href="/shop" className="text-base text-black font-serif hover:text-gray-600 transition-colors">SHOP</Link>
          <a className="text-base text-black font-serif" href="#custom">CUSTOM ORDER</a>
        </nav>
        {/* Logo */}
        <div className="flex items-center absolute left-1/2 -translate-x-1/2 justify-center">
          <Link href="/"><Image src="/logo-prano.svg" alt="Logo" width={40} height={56} /></Link>
        </div>
        {/* Desktop Right */}
        <div className="hidden sm:flex gap-10 text-black items-center">
          {user && (
            <Link href="/dashboard" className="text-base font-serif">DASHBOARD</Link>
          )}
          <a className="text-base font-serif" href="#about">ABOUT</a>
          <div className="flex items-center gap-2">
            <CartSheet />
          </div>
        </div>
        {/* Hamburger for mobile */}
        <button
          className="sm:hidden flex flex-col justify-center items-center w-10 h-10"
          aria-label="Open menu"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className="block w-6 h-0.5 bg-black mb-1"></span>
          <span className="block w-6 h-0.5 bg-black mb-1"></span>
          <span className="block w-6 h-0.5 bg-black"></span>
        </button>
      </div>
      {/* Mobile Menu */}
      {menuOpen && (
        <nav className="sm:hidden h-screen pt-48 w-screen flex flex-col gap-4 bg-white/95 p-6">
          <Link href="/shop" className="text-lg font-serif" onClick={() => setMenuOpen(false)}>SHOP</Link>
          <a className="text-lg font-serif" href="#custom" onClick={() => setMenuOpen(false)}>CUSTOM ORDER</a>
          <a className="text-lg font-serif" href="#about" onClick={() => setMenuOpen(false)}>ABOUT</a>
          <a className="text-lg font-serif" href="#cart" onClick={() => setMenuOpen(false)}>CART</a>

        </nav>
      )}
    </header>
  );
}