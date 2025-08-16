'use client';

import Image from "next/image";

interface InteractiveImageProps {
  src: string;
  alt: string;
}

export function InteractiveImage({ src, alt }: InteractiveImageProps) {
  return (
    <div className="relative aspect-square rounded-lg overflow-hidden">
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover hover:scale-105 transition-transform cursor-pointer"
        onClick={() => window.open(src, '_blank')}
      />
    </div>
  );
} 