import { BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import TopBanner from "@/components/TopBanner";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import instructorImage from "@/assets/instructor-about.jpg";
import { useSiteContentMultiple, getContentValue } from "@/hooks/useSiteContent";

const About = () => {
  const { data: content } = useSiteContentMultiple([
    "about_hero_heading",
    "about_hero_subheading",
    "about_founder_name",
    "about_founder_title",
    "about_founder_bio",
    "about_why_heading",
    "about_why_description"
  ]);

  const heroHeading = getContentValue(content, "about_hero_heading", "আমাদের সম্পর্কে");
  const heroSubheading = getContentValue(content, "about_hero_subheading", "শেখার নতুন যুগে স্বাগতম");
  const founderName = getContentValue(content, "about_founder_name", "NUR AL-AMIN");
  const founderTitle = getContentValue(content, "about_founder_title", "ফাউন্ডার ও লিড ইন্সট্রাক্টর");
  const founderBio = getContentValue(content, "about_founder_bio", "আমি NUR AL-AMIN, An-Nur Academy-র ফাউন্ডার ও লিড ইন্সট্রাক্টর। বিগত ৩ বছরেরও বেশি সময় ধরে আমি ডিজিটাল স্কিল ডেভেলপমেন্ট এবং অনলাইন শিক্ষার ক্ষেত্রে কাজ করে আসছি।");
  const whyHeading = getContentValue(content, "about_why_heading", "কেন An-Nur Academy?");
  const whyDescription = getContentValue(content, "about_why_description", "আমরা শুধু কোর্স বিক্রি করি না—আমরা স্কিল তৈরি করি। প্রতিটি কোর্স এমনভাবে সাজানো যাতে একদম নতুনরাও ধাপে ধাপে শিখতে পারে।");

  return (
    <div className="min-h-screen bg-background">
      <TopBanner />
      <Navbar />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              {heroHeading} <span className="text-primary">কিছু কথা</span>
            </h1>
            <p className="text-xl text-muted-foreground">{heroSubheading}</p>
          </div>

          {/* Main Content Grid */}
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            {/* Image Section */}
            <div className="relative animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={instructorImage}
                  alt={founderName}
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>

            {/* Text Section */}
            <div className="space-y-6 animate-fade-in" style={{ animationDelay: "0.4s" }}>
              <div className="border-l-4 border-primary pl-6 space-y-4">
                <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-line">
                  {founderBio}
                </p>
              </div>

              <div className="bg-primary/5 rounded-xl p-6 border-l-4 border-primary">
                <h3 className="text-2xl font-bold text-primary mb-2">{founderName}</h3>
                <p className="text-muted-foreground mb-1 font-semibold">{founderTitle}</p>
                <p className="text-sm text-foreground font-medium">Founder & CEO - An-Nur Academy</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-8">
            {whyHeading}
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed text-center max-w-4xl mx-auto mb-12">
            {whyDescription}
          </p>

          <div className="text-center">
            <Link to="/courses">
              <Button
                size="lg"
                className="gradient-purple text-white font-bold text-lg px-8 py-6 hover:opacity-90 transition-all hover:scale-105"
              >
                <BookOpen className="w-6 h-6 mr-2" />
                কোর্স দেখুন →
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
