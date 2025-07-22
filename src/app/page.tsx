import Image from "next/image";
import Product from "./components/product";

function Landing() {
  return (
    <div
      className="w-full h-[800px] rounded-lg"
      style={{
        backgroundImage: 'url(/hero-image.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    ></div>
  );
}

function NewArrivals() {
  return (
    <section className="w-full max-w-5xl flex flex-row items-center py-16 px-14 gap-32">
      <div className="flex flex-col items-center gap-6">
        <h2 className="text-3xl font-serif">NEW ARRIVALS</h2>
        <a href="#shop" className="text-base font-serif underline">View shop</a>
      </div>
      <div className="flex flex-col gap-8 overflow-x-auto w-full max-w-4xl">
        {/* Product cards placeholders */}
        <Product />
        <Product />
       <Product />
      </div>
    </section>
  );
}

function MeetMe() {
  return (
    <section className="w-full flex flex-col items-center py-32 px-14 gap-16">
      <h2 className="text-3xl font-serif mb-8">MEET ME</h2>
      <div className="flex flex-col md:flex-row gap-8 w-full">
        {/* Event 1 */}
        <div className="flex-1 bg-[#B7C5CE] rounded-lg p-6 flex flex-col gap-4">
          <div className="h-32 w-full rounded-lg mb-2" style={{backgroundImage: 'url(/meetme1.png)', backgroundSize: 'cover'}} />
          <div className="flex flex-col gap-2">
            <h3 className="text-2xl font-serif text-[#4C8A8A]">Amber Trip 2025</h3>
            <span className="text-base font-serif">LITEXPO, Vilnius ⋅ 13-15/02</span>
            <p className="text-sm font-sans text-[#4C8A8A]">Career planning in the field of design is essential for personal skill development and professional growth as a senior developer. Design is a creative art that can be applied to various industries and fields.</p>
            <a href="#" className="text-base font-serif underline">Read more</a>
          </div>
        </div>
        {/* Event 2 */}
        <div className="flex-1 bg-[#B7C5CE] rounded-lg p-6 flex flex-col gap-4">
          <div className="h-32 w-full rounded-lg mb-2" style={{backgroundImage: 'url(/meetme2.png)', backgroundSize: 'cover'}} />
          <div className="flex flex-col gap-2">
            <h3 className="text-2xl font-serif text-[#4C8A8A]">Kaziukas Fair</h3>
            <span className="text-base font-serif">Vilnius ⋅ 7-9/03</span>
            <p className="text-sm font-sans text-[#4C8A8A]">Career planning in the field of design is essential for personal skill development and professional growth as a senior developer. Design is a creative art that can be applied to various industries and fields.</p>
            <a href="#" className="text-base font-serif underline">Read more</a>
          </div>
        </div>
      </div>
    </section>
  );
}

function AboutPrano() {
  return (
    <section className="w-full flex flex-col items-center py-32 px-14 bg-white gap-16">
      <h2 className="text-3xl font-serif mb-8">ABOUT PRANO</h2>
      <div className="flex flex-col md:flex-row gap-8 w-full max-w-4xl">
        <div className="flex-1 flex flex-col gap-4">
          <p className="text-base font-sans">
            PRANO is perfect imperfection.<br /><br />
            It’s a space where traditional jewelry techniques meet contemporary forms – where every piece tells a story not just about metal or stone, but about you.<br /><br />
            PRANO is creation through attentiveness. Each piece is born from a conscious approach to materials and process: I work with recycled silver and gold, carefully select responsibly sourced stones, avoid excess, and strive for lasting beauty rather than fleeting trends.<br /><br />
            In a chaotic world, PRANO seeks to create stillness. Not through loud slogans, but through details, textures, sensations – elements that speak without words. Here, jewelry becomes a talisman, a small sculpture, an architecture of the body.
          </p>
          <a href="#" className="text-base font-serif underline">Read more</a>
        </div>
        <div className="flex-1 h-64 rounded-lg" style={{backgroundImage: 'url(/about-bg.png)', backgroundSize: 'cover'}} />
      </div>
    </section>
  );
}
export default function Home() {
  return (
    <div className="flex flex-col min-h-screen items-center w-full bg-white">
      <Landing />
      <NewArrivals />
      <MeetMe />
      <AboutPrano />
    </div>
  );
}
