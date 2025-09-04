import NewArrivals from "./_components/NewArrivals";
import MeetMe, { fetchLocations } from "./_components/MeetMeSection.tsx";
import AboutPrano from "./_components/AboutSection";

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

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
    <div className="flex flex-col min-h-screen items-center w-full bg-white">
      <Landing />
      <NewArrivals />
      {hasMeetLocations && <MeetMe />}
      <AboutPrano />
    </div>
  );
}
