import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, Facebook, Youtube, Send, Mail, GraduationCap, User, Settings, LogOut, ShoppingBag, ChevronDown } from "lucide-react";
import CartSidebar from "@/components/CartSidebar";
import logo from "@/assets/logo.png";
import { supabase } from "@/integrations/supabase/client";
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

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { profile } = useProfile();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsLoggedIn(!!user);
    };
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsLoggedIn(!!session?.user);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "লগআউট সফল",
      description: "আপনি সফলভাবে লগআউট হয়েছেন",
    });
    navigate("/");
  };

  const navLinks = [
    { to: "/", label: "হোম" },
    { to: "/about", label: "মেন্টর" },
    { to: "/courses", label: "সকল কোর্স" },
    { to: "/blog", label: "ব্লগ" },
    { to: "/contact", label: "যোগাযোগ" },
  ];

  const socialLinks = {
    facebook: "https://facebook.com/annuracademy",
    telegram: "https://t.me/annuracademy",
    youtube: "https://youtube.com/@annuracademy",
    email: "mailto:support@annuracademy.com"
  };

  return (
    <nav className="bg-white border-b border-border sticky top-0 z-50 backdrop-blur-sm bg-white/95">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
              A
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-foreground">An-Nur</span>
              <span className="text-xs text-primary font-semibold">ACADEMY</span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-foreground hover:text-primary transition-colors font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side - Cart & Dashboard/Login */}
          <div className="flex items-center gap-2">
            <CartSidebar />
            {!isLoggedIn && (
              <Link
                to="/student-login"
                className="hidden md:flex gradient-purple text-white font-semibold hover:opacity-90 px-4 py-2 rounded-md items-center gap-2"
              >
                <User className="w-5 h-5" />
                লগইন
              </Link>
            )}
            {isLoggedIn && (
              <Popover>
                <PopoverTrigger asChild>
                  <button className="hidden md:flex gradient-purple text-white font-semibold hover:opacity-90 px-4 py-2 rounded-md items-center gap-2">
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
                <PopoverContent className="w-72 p-0" align="end">
                  <div className="p-4 border-b border-border">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-12 h-12">
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
                    <Link to="/my-courses" className="block">
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start"
                        size="sm"
                      >
                        <GraduationCap className="w-4 h-4 mr-2" />
                        আমার কোর্স
                      </Button>
                    </Link>
                    <Link to="/profile-settings" className="block">
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start"
                        size="sm"
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        প্রোফাইল সেটিংস
                      </Button>
                    </Link>
                    <Link to="/my-orders" className="block">
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start"
                        size="sm"
                      >
                        <ShoppingBag className="w-4 h-4 mr-2" />
                        আমার অর্ডার
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
            )}
            
            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                  <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                    <Menu className="h-6 w-6 text-foreground" />
                  </button>
                </PopoverTrigger>
                <PopoverContent 
                  align="end" 
                  className="w-[220px] p-2 bg-background border border-border shadow-lg"
                >
                  <div className="flex flex-col">
                    {navLinks.map((link) => (
                      <Link
                        key={link.to}
                        to={link.to}
                        onClick={() => setIsOpen(false)}
                        className="px-4 py-2.5 text-foreground hover:bg-muted hover:text-primary rounded-md transition-colors font-medium"
                      >
                        {link.label}
                      </Link>
                    ))}
                    {isLoggedIn && (
                      <Link
                        to="/my-courses"
                        onClick={() => setIsOpen(false)}
                        className="px-4 py-2.5 text-foreground hover:bg-muted hover:text-primary rounded-md transition-colors font-medium flex items-center gap-2"
                      >
                        <GraduationCap className="w-4 h-4" />
                        ড্যাশবোর্ড
                      </Link>
                    )}
                    {!isLoggedIn && (
                      <Link
                        to="/student-login"
                        onClick={() => setIsOpen(false)}
                        className="px-4 py-2.5 text-foreground hover:bg-muted hover:text-primary rounded-md transition-colors font-medium flex items-center gap-2"
                      >
                        <User className="w-4 h-4" />
                        লগইন
                      </Link>
                    )}
                    
                    {/* Social Media Icons */}
                    <div className="flex justify-center gap-3 pt-3 mt-2 border-t border-border">
                      <a 
                        href={socialLinks.facebook} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="w-9 h-9 rounded-full border border-primary/20 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all duration-300"
                      >
                        <Facebook className="w-4 h-4" />
                      </a>
                      <a 
                        href={socialLinks.telegram} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="w-9 h-9 rounded-full border border-primary/20 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all duration-300"
                      >
                        <Send className="w-4 h-4" />
                      </a>
                      <a 
                        href={socialLinks.youtube} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="w-9 h-9 rounded-full border border-primary/20 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all duration-300"
                      >
                        <Youtube className="w-4 h-4" />
                      </a>
                      <a 
                        href={socialLinks.email}
                        className="w-9 h-9 rounded-full border border-primary/20 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all duration-300"
                      >
                        <Mail className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
