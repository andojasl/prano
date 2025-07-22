import Image from "next/image";

export default function Header() {
  return (
    <header className="w-full fixed top-0 bg-white/90 backdrop-blur-md px-14 pt-8 pb-8 flex flex-col gap-2" style={{boxShadow: '0 4px 32px rgba(0,0,0,0.04)'}}>
      <div className="flex items-center justify-between w-full">
        <nav className="flex gap-10 items-center">
          <a className="text-lg text-black font-serif" href="#shop">SHOP</a>
          <a className="text-lg text-black font-serif" href="#custom">CUSTOM ORDER</a>
        </nav>
        <div className="flex items-center justify-center">
          {/* Logo placeholder */}
          <Image src="/logo-prano.svg" alt="Logo" width={62} height={92} />
        </div>
        <div className="flex gap-10 text-black items-center">
          <a className="text-lg font-serif" href="#about">ABOUT</a>
          <div className="flex items-center gap-2">
            {/* Shopping cart icon placeholder */}
            <Image src="/cart.svg" alt="Cart" width={32} height={32} />
          </div>
          <span className="text-lg font-serif">EN</span>
        </div>
      </div>
    </header>
  );
}