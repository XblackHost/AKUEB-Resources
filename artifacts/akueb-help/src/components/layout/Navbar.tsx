import { Link } from "wouter";
import { BookOpen, LogOut, User as UserIcon } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useLogout } from "@workspace/api-client-react";

export function Navbar() {
  const { user, logout } = useAuth();
  const logoutMutation = useLogout({
    mutation: {
      onSuccess: () => {
        logout();
      }
    }
  });

  return (
    <nav className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-40">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-primary text-primary-foreground p-1.5 rounded-md group-hover:bg-primary/90 transition-colors">
            <BookOpen className="h-5 w-5" />
          </div>
          <span className="font-serif font-semibold text-lg text-foreground tracking-tight">
            AKUEB With Hatif
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <Link href="/classes" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Browse Classes
          </Link>
          
          <div className="h-4 w-px bg-border mx-2" />

          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground bg-accent/50 px-3 py-1.5 rounded-full">
                <UserIcon className="h-4 w-4 text-primary" />
                {user.name}
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => logoutMutation.mutate()}
                disabled={logoutMutation.isPending}
                className="text-muted-foreground hover:text-foreground"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login" className="text-sm font-medium text-foreground hover:text-primary transition-colors px-3 py-2">
                Log in
              </Link>
              <Link href="/register">
                <Button size="sm" className="font-medium">
                  Register
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
