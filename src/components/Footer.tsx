import { Facebook, Youtube, Send, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { useCourses } from "@/hooks/useCourses";
import { useSiteContentMultiple, getContentValue } from "@/hooks/useSiteContent";

const Footer = () => {
  const { data: courses } = useCourses();
  const { data: content } = useSiteContentMultiple([
    "footer_brand_description",
    "footer_copyright"
  ]);
  
  // Get first 4 courses as popular courses
  const popularCourses = courses?.slice(0, 4) || [];

  const brandDescription = getContentValue(
    content, 
    "footer_brand_description", 
    "An-Nur Academy—বাংলাদেশের সেরা অনলাইন লার্নিং প্ল্যাটফর্ম। আমরা বিশ্বাস করি সঠিক গাইডলাইন ও প্র্যাকটিক্যাল স্কিল দিয়ে যে কেউ সফল হতে পারে।"
  );
  
  const copyright = getContentValue(
    content,
    "footer_copyright",
    "© ২০২৫ An-Nur Academy. সর্বস্বত্ব সংরক্ষিত।"
  );

  const quickLinks = [
    { name: "আমাদের সম্পর্কে", url: "/about" },
    { name: "সাপোর্ট", url: "/contact" },
    { name: "রিফান্ড পলিসি", url: "/refund-policy" },
    { name: "প্রাইভেসি পলিসি", url: "/privacy-policy" },
  ];

  const socialLinks = {
    facebook: "https://facebook.com/annuracademy",
    telegram: "https://t.me/annuracademy",
    youtube: "https://youtube.com/@annuracademy",
    email: "mailto:support@annuracademy.com"
  };

  return (
    <footer className="bg-primary/5 border-t border-gray-200">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Brand Section */}
          <div className="space-y-6">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <div className="w-10 h-10 rounded-full border-2 border-primary border-dashed flex items-center justify-center">
                  <div className="w-6 h-6 rounded-full bg-primary"></div>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-foreground">
                  An-Nur Academy
                </span>
                <span className="text-xs text-primary font-bold uppercase tracking-wider">
                  All in one from ai
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground leading-relaxed">
              {brandDescription}
            </p>

            {/* Social Icons */}
            <div className="flex gap-3">
              <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border-2 border-primary/20 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all duration-300">
                <Facebook className="w-5 h-5" />
              </a>
              <a href={socialLinks.telegram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border-2 border-primary/20 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all duration-300">
                <Send className="w-5 h-5" />
              </a>
              <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border-2 border-primary/20 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all duration-300">
                <Youtube className="w-5 h-5" />
              </a>
              <a href={socialLinks.email} className="w-10 h-10 rounded-full border-2 border-primary/20 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all duration-300">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Popular Courses */}
          <div>
            <h3 className="text-foreground font-bold text-lg mb-6">
              জনপ্রিয় কোর্স
            </h3>
            <ul className="space-y-3">
              {popularCourses.map((course) => (
                <li key={course.id}>
                  <Link
                    to={`/courses/${course.slug}`}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300"
                  >
                    {course.title}
                  </Link>
                </li>
              ))}
              {popularCourses.length === 0 && (
                <li className="text-sm text-muted-foreground">কোর্স লোড হচ্ছে...</li>
              )}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-foreground font-bold text-lg mb-6">
              কুইক লিংকস
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.url}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center border-t border-black pt-8 mt-8">
          <p className="text-sm text-muted-foreground">{copyright}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
