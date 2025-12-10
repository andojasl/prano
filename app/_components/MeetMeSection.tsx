import { MeetCard } from "@/app/_types/MeetCard";
import MeetMeCard from "@/app/_components/MeetMeCard";

export async function fetchLocations() {
  let meetCards: MeetCard[] = [];
  try {
    // Use direct server-side call for better reliability
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();

    const { data: locationData, error } = await supabase
      .from("meet_locations")
      .select("*")
      .order("Date", { ascending: true });
    if (error) {
    } else {
      // Transform the data to match our interface
      meetCards = (locationData || []).map((location) => ({
        Title: location.title,
        City: location.city,
        Location: location.location,
        Image: location.Image,
        Link: location.Link,
        Date: new Date(location.Date),
      }));
    }
  } catch (error) {
  }
  return meetCards;
}

export default async function MeetMe() {
  const cards: MeetCard[] = await fetchLocations();

  return (
    <section className="w-full max-w-5xl py-24 flex flex-col items-start gap-16">
      <h2 className="text-3xl font-serif mb-8">MEET ME</h2>
      <div className="flex flex-col md:flex-row gap-8 w-full">
        {cards.length > 0 ? (
          cards.map((card, index) => <MeetMeCard key={index} card={card} />)
        ) : (
          <div className="flex-1 bg-[#B7C5CE] rounded-lg flex flex-row gap-4">
            <div
              className="h-full w-full rounded-l-lg mb-2"
              style={{
                backgroundImage: "url(/placeholder.png)",
                backgroundSize: "cover",
              }}
            />
            <div className="flex flex-col gap-2 p-6">
              <h3 className="text-2xl font-serif text-white">
                No Events Scheduled
              </h3>
              <span className="text-base font-headline">
                Check back soon for upcoming events
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
