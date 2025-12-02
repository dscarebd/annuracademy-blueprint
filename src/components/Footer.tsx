import { Facebook, Youtube, Instagram, Send } from "lucide-react";

const Footer = () => {
  // All editable content
  const content = {
    // Brand section
    brandDescription:
      "স্কিল ডেভেলপমেন্ট করে নিজেকে এমনভাবে গড়ে তুলুন, যেমন ভাবে একটি ছোট্ট বাল্ব অনিক প্রতিক্রিয়ার হয়ে উঠে। এই স্বপ্ন তোমার নিজেরী আমাদের নতুন আয়েম— যেখানে সফলতা হবে আপনার নিজেমের, আর আমরিকা হবে নিজের সংবুল নহিষা।",
    
    // Social links
    socialLinks: {
      facebook: "https://facebook.com",
      telegram: "https://t.me",
      instagram: "https://instagram.com",
      youtube: "https://youtube.com",
    },

    // All Courses
    allCourses: [
      { name: "WordPress Customization Mastery", url: "#courses" },
      { name: "Mastering AI Chatbot", url: "#courses" },
      { name: "Remote Job – MasterClass", url: "#courses" },
      { name: "Figma Essentials Training", url: "#courses" },
    ],

    // Quick Links
    quickLinks: [
      { name: "আমাদের সম্পর্কে", url: "#about" },
      { name: "রিফান্ড পলিসি", url: "#refund" },
      { name: "মার্চেন্ট রেজিস্ট্রেশন সর্তাবলি", url: "#merchant" },
      { name: "সাপোর্ট", url: "#support" },
      { name: "প্রাইভেসি পলিসি", url: "#privacy" },
      { name: "টেক্সটবুক গ্রপ", url: "#textbook" },
    ],

    // Copyright
    copyright: "© 2024 - 2025. All Rights Reserved.",
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
                education platform
              </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground leading-relaxed">
              {content.brandDescription}
            </p>

            {/* Social Icons */}
            <div className="flex gap-3">
              <a
                href={content.socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border-2 border-primary/20 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all duration-300"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href={content.socialLinks.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border-2 border-primary/20 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all duration-300"
              >
                <Send className="w-5 h-5" />
              </a>
              <a
                href={content.socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border-2 border-primary/20 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all duration-300"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href={content.socialLinks.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border-2 border-primary/20 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all duration-300"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* All Courses */}
          <div>
            <h3 className="text-foreground font-bold text-lg mb-6">
              সকল কোর্স
            </h3>
            <ul className="space-y-3">
              {content.allCourses.map((course, index) => (
                <li key={index}>
                  <a
                    href={course.url}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300"
                  >
                    {course.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-foreground font-bold text-lg mb-6">
              কুইক লিংকস
            </h3>
            <ul className="space-y-3">
              {content.quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.url}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">{content.copyright}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
