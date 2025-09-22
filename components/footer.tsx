import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full flex flex-col items-center py-12 border-t border-t-gray-200  px-14 bg-white/90 backdrop-blur-md gap-4">
      <div className="flex flex-col md:flex-row justify-between items-center w-full gap-4">
        <span className="text-sm font-sans">Copyright © prano</span>
        <div className="flex gap-4 items-center">
          {/* Social icons placeholders */}
          <a href="mailto:info@prano.com">
            <Image src="/icons/mail.svg" alt="Mail" width={28} height={28} />
          </a>
          <a href="#">
            <Image
              src="/icons/facebook.svg"
              alt="Facebook"
              width={28}
              height={28}
            />
          </a>
          <a href="#">
            <Image
              src="/icons/instagram.svg"
              alt="Instagram"
              width={28}
              height={28}
            />
          </a>
        </div>
      </div>
    </footer>
  );
}
