import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "./components/header";
import Footer from "./components/footer";

const argestaText = localFont({
  src: [
    {
      path: '../../public/fonts/Argesta_Webfont/argestatext-regular-webfont.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Argesta_Webfont/argestatext-regularitalic-webfont.woff2',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../../public/fonts/Argesta_Webfont/argestatext-bold-webfont.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: "--font-argesta",
  display: 'swap',
});

const argestaDisplay = localFont({
  src: [
    {
      path: '../../public/fonts/Argesta_Webfont/argestadisplay-regular-webfont.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Argesta_Webfont/argestadisplay-regularitalic-webfont.woff2',
      weight: '400',
      style: 'italic',
    },
  ],
  variable: "--font-argesta-display",
  display: 'swap',
});

const argestaHeadline = localFont({
  src: [
    {
      path: '../../public/fonts/Argesta_Webfont/argestaheadline-regular-webfont.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Argesta_Webfont/argestaheadline-regularitalic-webfont.woff2',
      weight: '400',
      style: 'italic',
    },
  ],
  variable: "--font-argesta-headline",
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Prano Jewelry",
  description: "Handcrafted jewelry with contemporary forms",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${argestaText.variable} ${argestaDisplay.variable} ${argestaHeadline.variable}`}>
      <body className="font-sans antialiased">
        <Header />

        <main className="max-full mx-auto px-14 bg-white pt-[120px]">{children}</main>
        <Footer />
  
      </body>
    </html>
  );
}
