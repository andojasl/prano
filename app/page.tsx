import NewArrivals from "./_components/NewArrivals";
import MeetMe, { fetchLocations } from "./_components/MeetMeSection";
import AboutPrano from "./_components/AboutSection";
import { Metadata } from "next";

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
    <div
      className="w-full h-[calc(100vh-120px)] md:h-[calc(100vh-135px)] rounded-lg"
      style={{
        backgroundImage: "url(/hero-image.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    ></div>
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
          <NewArrivals />
        </div>
      </div>
      {hasMeetLocations && <MeetMe />}
      <div className="py-24">
        <AboutPrano />
      </div>
    </div>
  );
}
