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
    <section className="bg-gradient-to-br from-gray-50 to-white py-16 md:py-24">
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
              {description || "স্কিল ডেভেলপ করে নিজেকে এমনভাবে গড়ে তুলুন, যেমন ভাবে একটা ছোট্ট গাছ ধীরে ধীরে বটবৃক্ষে পরিণত হয়। এই যাত্রায়, আজই শুরু হোক আপনার নতুন অধ্যায়—যেখানে সফলতা হবে আপনার নিত্যসঙ্গী, আর আপনি হবেন নিজের গল্পের নায়ক।"}
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
