import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <nav className="bg-white border-b border-border sticky top-0 z-50 backdrop-blur-sm bg-white/95">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
              A
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-foreground">An-Nur</span>
              <span className="text-xs text-primary font-semibold">ACADEMY</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-foreground hover:text-primary transition-colors font-medium">
              হোম
            </Link>
            <Link to="/about" className="text-foreground hover:text-primary transition-colors font-medium">
              মেন্টর
            </Link>
            <a href="/#courses" className="text-foreground hover:text-primary transition-colors font-medium">
              সকল কোর্স
            </a>
            <a href="#" className="text-foreground hover:text-primary transition-colors font-medium">
              যোগাযোগ
            </a>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            <button className="relative p-2 hover:bg-muted rounded-full transition-colors">
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                0
              </span>
            </button>
            <Button className="gradient-purple text-white font-semibold hover:opacity-90">
              লগ ইন
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
