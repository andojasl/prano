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
    <div className="flex-1 w-full md:max-w-[50%] bg-[#B7C5CE] rounded-lg flex flex-row gap-4">
      <Link href={card.Link || "#"} className="rounded-lg relative w-full h-64">
        <Image
          src={card.Image || "/placeholder.png"}
          alt={card.Title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover rounded-lg"
        />
        <div className="w-full rounded-b-lg absolute bottom-0 left-0 right-0 py-8 px-4 bg-black/60 flex flex-col items-left justify-between text-white text-m font-argesta">
          <p className="font-serif">{card.Title}</p>
          <p>
            {card.Location}, {card.City} ⋅ {formatDate(card.Date)}
          </p>
        </div>
      </Link>
    </div>
  );
}
