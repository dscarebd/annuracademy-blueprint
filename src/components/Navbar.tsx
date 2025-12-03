import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import CartSidebar from "@/components/CartSidebar";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { to: "/", label: "হোম" },
    { to: "/about", label: "মেন্টর" },
    { to: "/courses", label: "সকল কোর্স" },
    { to: "/blog", label: "ব্লগ" },
    { to: "/contact", label: "যোগাযোগ" },
  ];

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
            
            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                    <Menu className="h-6 w-6 text-foreground" />
                  </button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[280px] p-0">
                  <div className="flex flex-col h-full">
                    {/* Sidebar Header */}
                    <div className="p-4 border-b border-border">
                      <Link 
                        to="/" 
                        className="flex items-center gap-2"
                        onClick={() => setIsOpen(false)}
                      >
                        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                          A
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xl font-bold text-foreground">An-Nur</span>
                          <span className="text-xs text-primary font-semibold">ACADEMY</span>
                        </div>
                      </Link>
                    </div>

                    {/* Navigation Links */}
                    <div className="flex-1 py-4">
                      {navLinks.map((link) => (
                        <Link
                          key={link.to}
                          to={link.to}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center px-6 py-3 text-foreground hover:bg-muted hover:text-primary transition-colors font-medium"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>

                    {/* Footer */}
                    <div className="p-4 border-t border-border">
                      <p className="text-sm text-muted-foreground text-center">
                        © 2024 An-Nur Academy
                      </p>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
