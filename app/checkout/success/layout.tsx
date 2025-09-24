import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Order Confirmed - Thank You - Prano",
  description: "Your order has been successfully placed. Thank you for choosing Prano's handcrafted jewelry. You will receive a confirmation email shortly.",
  keywords: "order confirmation, purchase complete, jewelry order success, thank you",
  openGraph: {
    title: "Order Confirmed - Prano",
    description: "Your order has been successfully placed. Thank you for choosing Prano.",
    type: "website",
  },
  robots: {
    index: false, // Don't index success pages
    follow: false,
  },
};

export default function CheckoutSuccessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}