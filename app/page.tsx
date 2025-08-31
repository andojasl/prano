import NewArrivals from "./_components/NewArrivals";
import MeetMe from "./_components/MeetMeSection.tsx";
import AboutPrano from "./_components/AboutSection";

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
  return (
    <div className="flex flex-col min-h-screen items-center w-full bg-white">
      <Landing />
      <NewArrivals />
      <MeetMe />
      <AboutPrano />
    </div>
  );
}
