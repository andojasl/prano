import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import Link from "next/link";
import { Home, LayoutDashboard } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="flex justify-between items-center px-6 py-4">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 text-lg font-semibold hover:text-gray-600 transition-colors">
              <Home className="h-5 w-5" />
              <span>Prano Jewelry</span>
            </Link>
            <div className="flex items-center gap-2 text-gray-600">
              <LayoutDashboard className="h-4 w-4" />
              <span className="text-sm">Dashboard</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ThemeSwitcher />
            <AuthButton />
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="max-w-7xl mx-auto">
        {children}
      </main>
    </div>
  );
} 