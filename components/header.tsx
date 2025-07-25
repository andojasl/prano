"use client"
import Image from "next/image";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import Link from "next/link";

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
    <header className="w-full fixed top-0 bg-white/90 backdrop-blur-md px-6 sm:px-14 pt-8 pb-6 flex flex-col gap-2 z-50" style={{ boxShadow: '0 4px 32px rgba(0,0,0,0.04)' }}>
      <div className="flex items-center justify-between w-full">
        {/* Desktop Nav */}
        <nav className="hidden sm:flex gap-10 items-center">
          <Link href="/shop" className="text-base text-black font-serif hover:text-gray-600 transition-colors">SHOP</Link>
          <a className="text-base text-black font-serif" href="#custom">CUSTOM ORDER</a>
        </nav>
        {/* Logo */}
        <div className="flex items-center justify-center">
          <Link href="/"><Image src="/logo-prano.svg" alt="Logo" width={40} height={56} /></Link>
        </div>
        {/* Desktop Right */}
        <div className="hidden sm:flex gap-10 text-black items-center">
          <a className="text-base font-serif" href="#about">ABOUT</a>
          {!loading && user && (
            <Link href="/dashboard" className="text-base font-serif hover:text-gray-600 transition-colors">
              DASHBOARD
            </Link>
          )}
          <div className="flex items-center gap-2">
            <Image src="/cart.svg" alt="Cart" width={32} height={32} />
          </div>
          <div className="flex items-center gap-2">
            {!loading && user ? (
              <Link href="/dashboard">
                <Image src="/account.svg" alt="Account" width={24} height={24} />
              </Link>
            ) : (
              <Link href="/auth/login">
                <Image src="/account.svg" alt="Account" width={24} height={24} />
              </Link>
            )}
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
          {!loading && user && (
            <Link href="/dashboard" className="text-lg font-serif" onClick={() => setMenuOpen(false)}>
              DASHBOARD
            </Link>
          )}
          <a className="text-lg font-serif" href="#cart" onClick={() => setMenuOpen(false)}>CART</a>
          <span className="text-lg font-serif flex items-center gap-2">LT
            <Image src="/lt-flag.png" alt="Flag" width={24} height={24} className="items-center w-6 h-6" />
          </span>
        </nav>
      )}
    </header>
  );
}