import NewArrivals from "./_components/NewArrivals";
import MeetMe, { fetchLocations } from "./_components/MeetMeSection";
import AboutPrano from "./_components/AboutSection";
import NewArrivalsSkeleton from "./_components/NewArrivalsSkeleton";
import MeetMeSkeleton from "./_components/MeetMeSkeleton";
import { Suspense } from "react";
import { Metadata } from "next";
import Image from "next/image";

// Force dynamic rendering for this page
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Prano - Handcrafted Contemporary Jewelry",
  description: "Discover unique handcrafted jewelry with contemporary forms by Prano. Shop exclusive rings, necklaces, earrings and bracelets. Custom orders available.",
  keywords: "handcrafted jewelry, contemporary jewelry, custom jewelry, rings, necklaces, earrings, bracelets, unique jewelry, artisan jewelry",
  openGraph: {
    title: "Prano - Handcrafted Contemporary Jewelry",
    description: "Discover unique handcrafted jewelry with contemporary forms by Prano. Shop exclusive pieces and custom orders.",
    type: "website",
  },
};

function Landing() {
  return (
    <div className="relative w-full h-[calc(100vh-120px)] md:h-[calc(100vh-135px)] rounded-lg overflow-hidden">
      <Image
        src="/hero-image.webp"
        alt="Prano handcrafted jewelry showcase"
        fill
        priority
        className="object-cover"
        quality={85}
        sizes="100vw"
      />
    </div>
  );
}

export default async function Home() {
  // Fetch meet locations to determine if we should show MeetMe and About sections
  const meetLocations = await fetchLocations();
  const hasMeetLocations = meetLocations.length > 0;

  return (
    <div className="flex flex-col min-h-screen items-center w-full">
      <div className="pb-24 w-full">
        <Landing />
      </div>
      <div className="py-24 relative w-screen -mx-4 md:-mx-16">
        <div className="px-4 items-center md:px-16">
          <Suspense fallback={<NewArrivalsSkeleton />}>
            <NewArrivals />
          </Suspense>
        </div>
      </div>
      {hasMeetLocations && (
        <Suspense fallback={<MeetMeSkeleton />}>
          <MeetMe />
        </Suspense>
      )}
      <div className="py-24">
        <AboutPrano />
      </div>
    </div>
  );
}
