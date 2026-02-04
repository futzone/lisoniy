import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "@/hooks/useTheme";
import { useAuthStore } from "@/store/authStore";
import { Search, Sun, Moon, Menu } from "lucide-react";

interface NavbarProps {
  onMenuClick: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container flex h-16 items-center px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 mr-6">
          <img src="/lisoniy_small.png" alt="Lisoniy Logo" className="h-8 w-8 object-cover rounded-lg" />
          <span className="hidden font-bold text-foreground sm:inline-block text-xl">
            Lisoniy
          </span>
        </Link>

        {/* Search */}
        <div className="hidden md:flex md:flex-1 md:justify-center md:px-6">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Qidirish..."
              className="pl-8 bg-muted/50"
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 ml-auto">
          {/* Desktop Navigation */}
          <div className="hidden md:flex md:gap-6 md:mr-4">
            <Link
              to="/about"
              className={`text-sm font-medium transition-colors hover:text-primary ${isActive("/about") ? "text-primary" : "text-muted-foreground"
                }`}
            >
              Biz haqimizda
            </Link>
            <Link
              to="/hamjamiyat"
              className={`text-sm font-medium transition-colors hover:text-primary ${isActive("/hamjamiyat") ? "text-primary" : "text-muted-foreground"
                }`}
            >
              Hamjamiyat
            </Link>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="hidden md:inline-flex"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>

          {isAuthenticated ? (
            <Link to="/dashboard">
              <Button className="hidden md:inline-flex bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                Dashboard
              </Button>
            </Link>
          ) : (
            <>
              <Link to="/auth/login">
                <Button variant="ghost" className="hidden md:inline-flex">
                  Kirish
                </Button>
              </Link>

              <Link to="/auth/register">
                <Button className="hidden md:inline-flex">
                  Ro'yxatdan o'tish
                </Button>
              </Link>
            </>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>
    </nav>
  );
}