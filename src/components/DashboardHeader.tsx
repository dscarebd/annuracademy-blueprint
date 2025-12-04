import { Link, useNavigate } from "react-router-dom";
import { LogOut, Settings, Home } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const DashboardHeader = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { profile } = useProfile();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "লগআউট সফল",
      description: "আপনি সফলভাবে লগআউট হয়েছেন",
    });
    navigate("/");
  };

  return (
    <header className="bg-white border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm">
              A
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-foreground">An-Nur</span>
              <span className="text-[10px] text-primary font-semibold -mt-1">ACADEMY</span>
            </div>
          </Link>

          {/* Right Side */}
          <div className="flex items-center gap-2">
            <Link to="/">
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                <Home className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">হোম</span>
              </Button>
            </Link>
            <Link to="/profile-settings">
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                <Settings className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">সেটিংস</span>
              </Button>
            </Link>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleLogout}
              className="text-muted-foreground hover:text-destructive"
            >
              <LogOut className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">লগআউট</span>
            </Button>
            
            {/* User Avatar */}
            <div className="flex items-center gap-2 ml-2 pl-2 border-l border-border">
              <Avatar className="w-8 h-8">
                <AvatarImage src={profile?.avatar_url || ""} alt={profile?.full_name || "User"} />
                <AvatarFallback className="bg-primary/10 text-primary text-xs">
                  {profile?.full_name?.slice(0, 2).toUpperCase() || user?.email?.slice(0, 2).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-foreground hidden md:block max-w-[120px] truncate">
                {profile?.full_name || user?.email?.split('@')[0] || 'Student'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
