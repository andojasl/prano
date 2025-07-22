import Image from "next/image";
import Product from "./components/product";

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
    <section className="w-full flex flex-col items-center py-32 px-14 bg-white">
      {/* Header */}
      <div className="w-full max-w-6xl mb-16">
        <h2 className="text-4xl font-serif mb-8 text-center">ABOUT PRANO</h2>
      </div>

      {/* Main Content Grid */}
      <div className="w-full max-w-6xl space-y-20">
        
        {/* Philosophy Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <p className="text-lg font-sans leading-relaxed">
              <strong className="font-bold">PRANO is perfect imperfection.</strong><br />
              It's a space where traditional jewelry techniques meet contemporary forms – where every piece tells a story not just about metal or stone, but about you.
            </p>
            <p className="text-lg font-sans leading-relaxed">
              <strong className="font-bold">PRANO is creation through attentiveness.</strong> Each piece is born from a conscious approach to materials and process: I work with recycled silver and gold, carefully select responsibly sourced stones, avoid excess, and strive for lasting beauty rather than fleeting trends.
            </p>
          </div>
          <div className="h-80 rounded-lg overflow-hidden">
            <img src="/about/WhatsApp Image 2025-04-19 at 03.08.08.jpeg" alt="Jewelry crafting process" className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Values Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="h-80 rounded-lg overflow-hidden order-2 md:order-1">
            <img src="/about/WhatsApp Image 2025-04-19 at 03.08.08(1).jpeg" alt="Handcrafted jewelry details" className="w-full h-full object-cover" />
          </div>
          <div className="space-y-6 order-1 md:order-2">
            <p className="text-lg font-sans leading-relaxed">
              In a chaotic world, PRANO seeks to create stillness. Not through loud slogans, but through details, textures, sensations – elements that speak without words. Here, jewelry becomes a talisman, a small sculpture, an architecture of the body.
            </p>
            <p className="text-lg font-sans leading-relaxed">
              To me, jewelry is more than an accessory. It's a reflection of the inner world, a symbol of values, a quiet statement. Each piece is an invitation to pause, to feel, to hear yourself – just as you are.
            </p>
          </div>
        </div>

        {/* Custom Orders Section */}
        <div className="text-center space-y-8">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-serif mb-6">Custom Orders</h3>
            <p className="text-lg font-sans leading-relaxed">
              A large part of my time and energy goes into custom orders. Whether it's a minimal everyday ring or a one-of-a-kind engagement piece filled with meaning and intention – every project matters deeply to me. I believe that jewelry should reflect a person's story, which is why each custom order becomes a shared creative process between me and the client.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="h-64 rounded-lg overflow-hidden">
              <img src="/about/WhatsApp Image 2025-04-19 at 03.08.08(2).jpeg" alt="Custom jewelry piece 1" className="w-full h-full object-cover" />
            </div>
            <div className="h-64 rounded-lg overflow-hidden">
              <img src="/about/WhatsApp Image 2025-04-19 at 03.08.08(3).jpeg" alt="Custom jewelry piece 2" className="w-full h-full object-cover" />
            </div>
            <div className="h-64 rounded-lg overflow-hidden">
              <img src="/about/WhatsApp Image 2025-04-19 at 03.08.08(4).jpeg" alt="Custom jewelry piece 3" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>

        {/* Personal Story Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h3 className="text-2xl font-serif mb-6">The Person Behind PRANO</h3>
            <p className="text-lg font-sans leading-relaxed">
              Behind the name PRANO is me – Pranas Gurevičius, a jeweler whose journey began back in school. My first jewelry collection became not only a graduation project but also the starting point of my creative path, which I continued at Kaunas School of Applied Arts.
            </p>
            <p className="text-lg font-sans leading-relaxed">
              In the summer of 2024, I completed an internship at M.C. Jewellery in Limassol, Cyprus, where I studied various branches of jewelry craft under the guidance of professionals. One of my dearest creations – the necklace "THE TRIP OF AMBER" – received the Audience Award at the international Amber Trip exhibition in 2025.
            </p>
          </div>
          <div className="h-96 rounded-lg overflow-hidden">
            <img src="/about/WhatsApp Image 2025-04-19 at 03.08.07.jpeg" alt="Pranas at work" className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Closing Statement */}
        <div className="text-center max-w-3xl mx-auto space-y-8">
          <p className="text-xl font-sans leading-relaxed italic">
            "That was one of the first moments I felt that my work spoke not only to me, but to others as well."
          </p>
          <div className="h-64 rounded-lg overflow-hidden">
            <img src="/about/WhatsApp Image 2025-04-19 at 03.08.07(1).jpeg" alt="Award-winning jewelry piece" className="w-full h-full object-cover" />
          </div>
          <p className="text-2xl font-serif">
            I believe jewelry doesn't have to be perfect – it has to be alive.<br />
            Just like us.
          </p>
          <a href="/custom-order" className="inline-block text-lg font-headline underline hover:no-underline transition-all duration-300">
            Start Your Custom Order
          </a>
        </div>

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
