import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div className="space-y-8">
        {/* 404 in defonte font */}
        <h1 className="text-8xl md:text-9xl font-normal text-black heading-font">
          404
        </h1>

        {/* Rest of content in sans-serif */}
        <div className="space-y-4 font-sans">
          <h2 className="text-2xl md:text-3xl font-light text-gray-800">
            Page Not Found
          </h2>

          <p className="text-gray-600 max-w-md mx-auto text-lg leading-relaxed">
            The page you're looking for doesn't exist. It might have been moved,
            deleted, or you entered the wrong URL.
          </p>

          <div className="pt-6">
            <Link
              href="/"
              className="inline-block bg-black rounded-lg text-white px-8 py-3 hover:bg-gray-800 transition-colors duration-200 text-sm tracking-wide uppercase font-medium"
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
