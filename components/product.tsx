"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { getProductUrl } from "@/lib/utils";
import useIsMobile from "@/app/_utils/isMobile";

interface ProductProps {
  displayImage: string;
  hoverImage?: string;
  title: string;
  slug: string;
  categorySlug: string;
  price: string;
  width: number; // Tailwind size like "64", "48", etc.
  height: number; // Tailwind size like "64", "48", etc.
}

export default function Product({
  displayImage,
  hoverImage,
  title,
  slug,
  categorySlug,
  price,
}: ProductProps) {
  const [isHovered, setIsHovered] = useState(false);
  const productUrl = getProductUrl(categorySlug, slug);
  const isMobile = useIsMobile();

  return (
    <Link
      href={productUrl}
      className="rounded-lg relative overflow-hidden cursor-pointer transition-all duration-300 aspect-[1/1] block w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isMobile ? (
        <>
          <Image
            src={isHovered && hoverImage ? hoverImage : displayImage}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-all duration-300"
          />
          <div className="absolute bottom-0 left-0 right-0 py-8 px-4 bg-black/40 backdrop-blur-sm flex items-center justify-between text-white text-m font-argesta">
            <p>{title}</p>
            <p>{price}€</p>
          </div>
        </>
      ) : (
        <>
          <Image
            src={isHovered && hoverImage ? hoverImage : displayImage}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-all duration-300"
          />
          {isHovered && (
            <div className="absolute inset-0 bg-black/40 flex flex-row items-center gap-4 px-4 transition-all duration-300">
              <h3 className="text-white text-m font-argesta flex-1">{title}</h3>
              <p className="text-white text-m font-argesta whitespace-nowrap flex-shrink-0">
                {price} €
              </p>
            </div>
          )}
        </>
      )}
    </Link>
  );
}
