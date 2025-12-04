import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, Facebook, Youtube, Send, Mail, GraduationCap, User } from "lucide-react";
import CartSidebar from "@/components/CartSidebar";
import { supabase } from "@/integrations/supabase/client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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

          {/* Right Side - Cart & Mobile Menu */}
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
              <Link
                to="/my-courses"
                className="hidden md:flex gradient-purple text-white font-semibold hover:opacity-90 px-4 py-2 rounded-md items-center gap-2"
              >
                <GraduationCap className="w-5 h-5" />
                ড্যাশবোর্ড
              </Link>
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
