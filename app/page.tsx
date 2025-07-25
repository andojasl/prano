import Image from "next/image";
import Product from "../components/product";

function Landing() {
  return (
    <div
      className="w-full h-[calc(100vh-135px)] md:h-[calc(100vh-135px)] rounded-lg"
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
    <section className="w-full max-w-5xl flex flex-row max-h-screen items-center py-16 px-14 justify-between">
      <div className="flex left-0 flex-col gap-6">
        <h2 className="text-3xl font-serif">NEW ARRIVALS</h2>
        <a href="#shop" className="text-base font-serif underline">View shop</a>
      </div>
      <div className="flex flex-col gap-8 overflow-x-auto max-w-4xl ">
        {/* Product cards placeholders */}
       <div className="flex flex-row gap-4 justify-end">
        <Product displayImage="/product-square.png" hoverImage="/image-hover.png" title="Product 1" price="600" width={96}  height={48} />
        </div>
        <Product displayImage="/product-square.png" hoverImage="/image-hover.png" title="Product 2" price="59" width={112}  height={56} />
       <div className="flex flex-row gap-4 justify-end">
        <Product displayImage="/product-square.png" hoverImage="/image-hover.png" title="Product 3" price="200" width={104}  height={48} />
        </div>
      </div>
    </section>
  );
}

function MeetMe() {
  return (
    <section className="w-full max-w-5xl flex flex-col items-start py-32 px-14 gap-16">
      <h2 className="text-3xl font-serif mb-8">MEET ME</h2>
      <div className="flex flex-col md:flex-row gap-8 w-full">
        {/* Event 1 */}
        <div className="flex-1 bg-[#B7C5CE] rounded-lg flex flex-row gap-4">
          <div className="h-full w-full rounded-l-lg mb-2" style={{backgroundImage: 'url(/amber.png)', backgroundSize: 'cover'}} />
          <div className="flex flex-col gap-2 p-6">
            <h3 className="text-2xl font-serif text-white">Amber Trip 2025</h3>
            <span className="text-base font-headline">LITEXPO, Vilnius ⋅ 13-15/02</span>
            <a href="#" className="text-white font-headline">Read more</a>
          </div>
        </div>
         <div className="flex-1 bg-[#B7C5CE] rounded-lg flex flex-row gap-4">
          <div className="h-full w-full rounded-l-lg mb-2" style={{backgroundImage: 'url(/kaziukas.png)', backgroundSize: 'cover'}} />
          <div className="flex flex-col gap-2 p-6">
            <h3 className="text-2xl font-serif text-white">Kaziukas Fair</h3>
            <span className="text-base font-headline">Vilnius ⋅ 7-9/03</span>
            <a href="#" className="text-white font-headline">Read more</a>
          </div>
        </div>
      </div>
    </section>
  );
}

function AboutPrano() {
  return (
    <section className="w-full max-w-5xl flex flex-col items-start py-32 px-14 gap-16">
      <h2 className="text-3xl font-serif mb-8">ABOUT PRANO</h2>
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
