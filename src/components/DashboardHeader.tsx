import { Link, useNavigate } from "react-router-dom";
import { LogOut, Settings, Home, ChevronDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import BrandLogo from "@/components/BrandLogo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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
          <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
            <BrandLogo variant="header" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            <Link to="/">
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                <Home className="w-4 h-4 mr-1" />
                হোম
              </Button>
            </Link>
            <Link to="/profile-settings">
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                <Settings className="w-4 h-4 mr-1" />
                সেটিংস
              </Button>
            </Link>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleLogout}
              className="text-muted-foreground hover:text-destructive"
            >
              <LogOut className="w-4 h-4 mr-1" />
              লগআউট
            </Button>
            
            {/* User Avatar */}
            <div className="flex items-center gap-2 ml-2 pl-2 border-l border-border">
              <Avatar className="w-8 h-8">
                <AvatarImage src={profile?.avatar_url || ""} alt={profile?.full_name || "User"} />
                <AvatarFallback className="bg-primary/10 text-primary text-xs">
                  {profile?.full_name?.slice(0, 2).toUpperCase() || user?.email?.slice(0, 2).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-foreground max-w-[120px] truncate">
                {profile?.full_name || user?.email?.split('@')[0] || 'Student'}
              </span>
            </div>
          </div>

          {/* Mobile Dropdown */}
          <div className="md:hidden">
            <Popover>
              <PopoverTrigger asChild>
                <button className="gradient-purple text-white font-semibold hover:opacity-90 px-3 py-2 rounded-md flex items-center gap-2 text-sm">
                  <Avatar className="w-6 h-6 border border-white/30">
                    <AvatarImage src={profile?.avatar_url || ""} alt={profile?.full_name || "User"} />
                    <AvatarFallback className="bg-white/20 text-white text-xs">
                      {profile?.full_name?.slice(0, 2).toUpperCase() || user?.email?.slice(0, 2).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  ড্যাশবোর্ড
                  <ChevronDown className="w-4 h-4" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-0 bg-background border border-border shadow-lg" align="end">
                <div className="p-3 border-b border-border">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={profile?.avatar_url || ""} alt={profile?.full_name || "User"} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {profile?.full_name?.slice(0, 2).toUpperCase() || user?.email?.slice(0, 2).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">
                        {profile?.full_name || user?.email?.split('@')[0] || 'Student'}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                    </div>
                  </div>
                </div>
                <div className="p-2">
                  <Link to="/" className="block">
                    <Button variant="ghost" className="w-full justify-start" size="sm">
                      <Home className="w-4 h-4 mr-2" />
                      হোম
                    </Button>
                  </Link>
                  <Link to="/profile-settings" className="block">
                    <Button variant="ghost" className="w-full justify-start" size="sm">
                      <Settings className="w-4 h-4 mr-2" />
                      প্রোফাইল সেটিংস
                    </Button>
                  </Link>
                  <Button 
                    variant="ghost" 
                    onClick={handleLogout}
                    className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                    size="sm"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    লগ আউট
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
