"use client"
import Image from "next/image";
import { useState } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="w-full fixed top-0 bg-white/90 backdrop-blur-md px-6 sm:px-14 pt-8 pb-6 flex flex-col gap-2 z-50" style={{boxShadow: '0 4px 32px rgba(0,0,0,0.04)'}}>
      <div className="flex items-center justify-between w-full">
        {/* Desktop Nav */}
        <nav className="hidden sm:flex gap-10 items-center">
          <a className="text-base text-black font-serif" href="/shop">SHOP</a>
          <a className="text-base text-black font-serif" href="#custom">CUSTOM ORDER</a>
        </nav>
        {/* Logo */}
        <div className="flex items-center justify-center">
          <a href="/"><Image src="/logo-prano.svg" alt="Logo" width={40} height={56} /></a>
        </div>
        {/* Desktop Right */}
        <div className="hidden sm:flex gap-10 text-black items-center">
          <a className="text-base font-serif" href="#about">ABOUT</a>
          <div className="flex items-center gap-2">
            <Image src="/cart.svg" alt="Cart" width={32} height={32} />
          </div>
          <span className="text-base font-serif flex items-center gap-2">LT
          <Image src="/lt-flag.png" alt="Flag" width={24} height={24} /></span>
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
        <a className="text-lg font-serif" href="#shop" onClick={() => setMenuOpen(false)}>SHOP</a>
        <a className="text-lg font-serif" href="#custom" onClick={() => setMenuOpen(false)}>CUSTOM ORDER</a>
        <a className="text-lg font-serif" href="#about" onClick={() => setMenuOpen(false)}>ABOUT</a>
        <a className="text-lg font-serif" href="#cart" onClick={() => setMenuOpen(false)}>CART</a>
        <span className="text-lg font-serif flex items-center gap-2">LT
        <Image src="/lt-flag.png" alt="Flag" width={24} height={24} className="items-center w-6 h-6" />
        </span>
      </nav>
    )}
    </header>
  );
}