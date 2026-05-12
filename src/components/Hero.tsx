import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-image.jpg";

interface HeroProps {
  title?: string | null;
  subtitle?: string | null;
  description?: string | null;
  buttonText?: string | null;
  buttonLink?: string | null;
  imageUrl?: string | null;
}

const Hero = ({
  title,
  subtitle,
  description,
  buttonText,
  buttonLink,
  imageUrl,
}: HeroProps) => {
  return (
    <section className="bg-gradient-to-br from-gray-50 to-white pt-6 pb-12 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6 animate-fade-in">
            {subtitle && (
              <div className="inline-block bg-purple-50 text-primary px-4 py-2 rounded-full text-sm font-medium">
                👨‍💻 {subtitle}
              </div>
            )}
            {!subtitle && (
              <div className="inline-block bg-purple-50 text-primary px-4 py-2 rounded-full text-sm font-medium">
                👨‍💻 ইনশাআল্লাহ্‌ আপনিও পারবেন
              </div>
            )}
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              {title || (
                <>
                  কঠিন এবং জটিল টপিক হবে{" "}
                  <span className="text-gradient">পানির মত সহজ</span>
                </>
              )}
            </h1>
            
            <p className="text-lg text-muted-foreground leading-relaxed">
              {description || "আজকের দিনে সঠিক স্কিল মানেই সীমাহীন সম্ভাবনা। আমাদের কোর্সগুলো আপনাকে দেবে সেই শক্তি—যা দিয়ে আপনি ফ্রিল্যান্সিং, রিমোট জব কিংবা নিজের ব্যবসা গড়তে পারবেন। শুরু করুন আজই, কারণ প্রতিটি সফল মানুষের গল্প শুরু হয়েছিল একটি সাহসী পদক্ষেপ দিয়ে।"}
            </p>
            
            <div className="pt-4">
            <Link to={buttonLink || "/courses"}>
              <Button 
                size="lg" 
                className="gradient-purple text-white font-semibold text-lg px-8 py-6 hover:opacity-90 hover:scale-105 transition-all"
              >
                {buttonText || "শেখা শুরু করুন"} →
              </Button>
            </Link>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <img 
              src={imageUrl || heroImage} 
              alt="Instructor" 
              className="w-full h-auto rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
