"use client";

import { ClientAuthButton } from "@/components/client-auth-button";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [backNav, setBackNav] = useState<{
    href: string;
    label: string;
  } | null>(null);

  useEffect(() => {
    const getBackNavigation = () => {
      // Main dashboard - no back button
      if (pathname === "/dashboard") {
        return null;
      }

      // Sub-pages - determine parent
      if (pathname.includes("/dashboard/texts/")) {
        if (pathname.includes("/edit")) {
          return { href: "/dashboard/texts", label: "Back to Texts" };
        }
      }

      if (pathname.includes("/dashboard/orders/")) {
        return { href: "/dashboard/orders", label: "Back to Orders" };
      }

      if (pathname.includes("/dashboard/custom-requests/")) {
        return {
          href: "/dashboard/custom-requests",
          label: "Back to Custom Requests",
        };
      }

      if (pathname.includes("/dashboard/meet-locations/")) {
        if (pathname.includes("/edit")) {
          return {
            href: "/dashboard/meet-locations",
            label: "Back to Meet Locations",
          };
        }
      }

      // Create pages and main section pages go back to dashboard
      return { href: "/dashboard", label: "Back to Dashboard" };
    };

    setBackNav(getBackNavigation());
  }, [pathname]);

  return (
    <div className="min-h-screen">
      {/* Dashboard Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center gap-6">
            {backNav && (
              <Link href={backNav.href}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="flex [&_svg]:size-8 items-center gap-2"
                >
                  <ArrowLeft />
                </Button>
              </Link>
            )}
          </div>
          <div className="flex items-center gap-4">
            <ClientAuthButton />
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="max-w-7xl mx-auto">{children}</main>
    </div>
  );
}
