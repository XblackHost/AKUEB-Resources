import { Link } from "wouter";
import { BookOpen } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/60 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="bg-primary text-primary-foreground p-1 rounded-md">
              <BookOpen className="h-4 w-4" />
            </div>
            <span className="font-serif font-semibold text-sm text-foreground">AKUEB With Hatif</span>
          </div>

          <p className="text-xs text-muted-foreground text-center sm:text-left">
            An independent student resource platform. Not affiliated with AKUEB.
          </p>

          <div className="flex items-center gap-5 text-xs text-muted-foreground">
            <Link href="/legal" className="hover:text-foreground transition-colors">
              Privacy & Legal
            </Link>
            <Link href="/classes" className="hover:text-foreground transition-colors">
              Browse Classes
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
