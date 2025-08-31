import NewArrivals from "./_components/NewArrivals";
import MeetMe from "./_components/MeetMeSection.tsx/page";

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

function AboutPrano() {
  return (
    <section className="w-full max-w-5xl flex flex-col items-start py-32 gap-16">
      <h2 className="text-3xl font-serif mb-8">ABOUT PRANO</h2>
      <div
        className="w-full rounded-lg h-48"
        style={{
          backgroundImage: "url(/about-bg.jpeg)",
        }}
      ></div>
      <div className="flex flex-row w-full gap-16">
        <div>
          PRANO is perfect imperfection. It’s a space where traditional jewelry
          techniques meet contemporary forms – where every piece tells a story
          not just about metal or stone, but about you.
        </div>
        <div>
          PRANO is creation through attentiveness. Each piece is born from a
          conscious approach to materials and process: I work with recycled
          silver and gold, carefully select responsibly sourced stones, avoid
          excess, and strive for lasting beauty rather than fleeting trends.
        </div>
      </div>
    </section>
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
