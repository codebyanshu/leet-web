import React from "react";
import { Code2, Github, LogIn, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const { user, profile, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
            <Code2 className="w-5 h-5 text-primary" />
          </div>
          <span className="font-bold text-lg">
            <span className="text-foreground">LC</span>
            <span className="text-primary">Board</span>
          </span>
        </div>

        <nav className="flex items-center gap-4">
          {user ? (
            <>
              <div className="flex items-center gap-2 text-sm">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="font-mono text-muted-foreground">
                  {profile?.username || user.email}
                </span>
                {isAdmin && (
                  <span className="px-2 py-0.5 text-xs font-mono bg-primary/10 text-primary rounded-full border border-primary/20">
                    Admin
                  </span>
                )}
              </div>
              <Button variant="ghost" size="sm" onClick={signOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </>
          ) : (
            <Button variant="ghost" size="sm" onClick={() => navigate("/auth")}>
              <LogIn className="w-4 h-4 mr-2" />
              Login
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
