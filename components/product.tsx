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
    <div className="rounded-lg cursor-pointer transition-all duration-300 block w-full">
      <Link
        href={productUrl}
        className="rounded-lg relative overflow-hidden aspect-[1/1] block w-full"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {isMobile ? (
          <Image
            src={isHovered && hoverImage ? hoverImage : displayImage}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-all duration-300"
          />
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
      {isMobile && (
        <div className="pt-3 text-center">
          <p className="text-black text-sm font-argesta">{title}</p>
          <p className="text-gray-600 text-sm font-argesta">{price}€</p>
        </div>
      )}
    </div>
  );
}
