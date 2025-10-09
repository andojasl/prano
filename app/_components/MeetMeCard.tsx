import { MeetCard } from "../_types/MeetCard";
import Image from "next/image";
import Link from "next/link";

interface MeetMeCardProps {
  card: MeetCard;
}

export default function MeetMeCard({ card }: MeetMeCardProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
    });
  };

  return (
    <div className="w-full bg-white rounded-lg flex flex-col hover:shadow-lg transition-shadow duration-300 border border-gray-200 h-full">
      <Link href={card.Link || "#"} className="rounded-t-lg overflow-hidden relative w-full h-64 flex-shrink-0">
        <Image
          src={card.Image || "/placeholder.png"}
          alt={card.Title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
        />
      </Link>
      <div className="px-4 pb-4 pt-4 flex-grow flex flex-col justify-between">
        <div>
          <p className="font-serif text-black text-m font-argesta mb-2 break-words">{card.Title}</p>
          <p className="text-black text-m font-argesta break-words leading-relaxed">
            {card.Location}, {card.City} ⋅ {formatDate(card.Date)}
          </p>
        </div>
      </div>
    </div>
  );
}
