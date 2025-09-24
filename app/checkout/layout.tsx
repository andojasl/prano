import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Checkout - Complete Your Order - Prano",
  description: "Complete your purchase of handcrafted jewelry from Prano. Secure checkout with multiple payment options. Free shipping worldwide.",
  keywords: "checkout, buy jewelry, secure payment, handcrafted jewelry purchase, jewelry order",
  openGraph: {
    title: "Checkout - Prano",
    description: "Complete your purchase of handcrafted jewelry from Prano.",
    type: "website",
  },
  robots: {
    index: false, // Don't index checkout pages
    follow: true,
  },
};

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}