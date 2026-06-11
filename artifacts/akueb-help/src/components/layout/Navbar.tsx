import { Link } from "wouter";
import { BookOpen, Moon, Sun, GraduationCap } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useAdmin } from "@/contexts/AdminContext";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { isAdmin } = useAdmin();

  return (
    <nav className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-40">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-primary text-primary-foreground p-1.5 rounded-md group-hover:bg-primary/90 transition-colors">
            <BookOpen className="h-5 w-5" />
          </div>
          <span className="font-serif font-semibold text-lg text-foreground tracking-tight">
            AKUEB Resources
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <Link href="/classes" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-2">
            Browse Classes
          </Link>

          <Link href="/admission">
            <Button size="sm" variant="default" className="rounded-full px-4 gap-1.5 bg-primary shadow-sm font-semibold">
              <GraduationCap className="h-4 w-4" />
              Book a Demo
            </Button>
          </Link>

          {isAdmin && (
            <Link
              href="/admin/admissions"
              className="text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 px-3 py-1.5 rounded-full hover:opacity-80 transition-opacity"
            >
              Requests
            </Link>
          )}

          <div className="h-4 w-px bg-border mx-1" />

          <Button variant="ghost" size="icon" onClick={toggleTheme} className="text-muted-foreground hover:text-foreground">
            {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </Button>
        </div>
      </div>
    </nav>
  );
}
