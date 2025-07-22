"use client"
import Image from "next/image";
import { useState } from "react";

interface ProductProps {
  displayImage: string;
  hoverImage?: string;
  title: string;
  price: string;
  width: number; // Tailwind size like "64", "48", etc.
  height: number; // Tailwind size like "64", "48", etc.
}

export default function Product({displayImage, hoverImage, title, price, width, height}: ProductProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="rounded-lg relative overflow-hidden cursor-pointer transition-all duration-300 aspect-square"
      style={{ width: `${width * 4}px`, height: `${height * 4}px` }}
      // Note: Tailwind's "64" = 16rem = 256px, so multiply by 4 to convert
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Image
        src={isHovered && hoverImage ? hoverImage : displayImage}
        alt="Product"
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-cover transition-all duration-300"
      />
      {isHovered && (
        <div className="absolute inset-0 bg-black/40 flex flex-row items-center justify-between px-4 transition-all duration-300">
          <h3 className="text-white text-xl font-bold mb-2">{title}</h3>
          <p className="text-white text-lg font-semibold">{price} €</p>
        </div>
      )}
    </div>
  );
}