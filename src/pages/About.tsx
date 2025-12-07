import { BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import TopBanner from "@/components/TopBanner";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import instructorImage from "@/assets/instructor-about.jpg";

const About = () => {
  // Same content as home page AboutMeSection
  const content = {
    heading: "আমার সম্পর্কে",
    headingHighlight: "কিছু কথা",
    subtitle: "কে, কেন, কিভাবে?",
    
    bio1: "আমি নুর আল-আমীন—একজন প্যাশনেট ওয়ার্ডপ্রেস ডিজাইনার, ডিজিটাল স্কিল (এআই অটোমেশন) ইনস্ট্রাক্টর এবং An-Nur Academy-এর প্রতিষ্ঠাতা। গত কয়েক বছর ধরে আমি বিশ্বব্যাপী ক্লায়েন্টদের সাথে কাজ করে বিভিন্ন টেক-বেইজড প্রজেক্ট সফলভাবে সম্পন্ন করেছি। যেখানে আমি শত শত ক্লায়েন্টকে ওয়েব ডিজাইন সার্ভিস দিয়ে সহায়তা করেছি।",
    
    bio2: "টেকনোলজি শেখার প্রতি আমার আগ্রহ থেকেই আমি নতুন নতুন স্কিল শেখা এবং অন্যদের শেখাতে ভালোবাসি। এজন্যই আমি তৈরি করেছি An-Nur Academy, যেখানে শিক্ষার্থীরা সহজ ভাষায় কোডিং, এআই অটোমেশন, চ্যাটজিপিটি মাস্টারক্লাস সহ আধুনিক স্কিল শিখতে পারবে।",
    
    name: "নুর আল-আমীন",
    title: "ওয়ার্ডপ্রেস ডিজাইনার, ইনস্ট্রাক্টর",
    role: "Founder & CEO - An-Nur Academy",
  };

  return (
    <div className="min-h-screen bg-background">
      <TopBanner />
      <Navbar />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              {content.heading} <span className="text-primary">{content.headingHighlight}</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              {content.subtitle}
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            {/* Image Section */}
            <div className="relative animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={instructorImage}
                  alt={content.name}
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>

            {/* Text Section */}
            <div className="space-y-6 animate-fade-in" style={{ animationDelay: "0.4s" }}>
              <div className="border-l-4 border-primary pl-6 space-y-4">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {content.bio1}
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {content.bio2}
                </p>
              </div>

              <div className="bg-primary/5 rounded-xl p-6 border-l-4 border-primary">
                <h3 className="text-2xl font-bold text-primary mb-2">
                  {content.name}
                </h3>
                <p className="text-muted-foreground mb-1 font-semibold">
                  {content.title}
                </p>
                <p className="text-sm text-foreground font-medium">
                  {content.role}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-8">
            কেন?
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed text-center max-w-4xl mx-auto mb-12">
            শিক্ষার্থীরা আমাদের কোর্স কিনে কারণ আমরা শেখাই একদম সহজভাবে, ধাপে ধাপে এবং বাস্তবে কাজে লাগে এমন স্কিল। এখানে অযথা জটিল তত্ত্ব নেই—বরং যা শিখবেন, তা সরাসরি নিজের কাজ, ক্যারিয়ার বা ফ্রিল্যান্সিংয়ে ব্যবহার করতে পারবেন। প্রতিটি কোর্স নতুনদের কথা ভেবেই তৈরি, যাতে যেকোনো শিক্ষার্থী খুব সহজে শুরু করতে পারে এবং নিশ্চিতভাবে অগ্রগতি দেখতে পায়। আমরা শুধু কোর্স দিই না—শেখার সময় যেকোনো সমস্যায় পাশে থাকার প্রতিশ্রুতিও দিই। তাই যারা সত্যি স্কিল শিখে সামনে এগোতে চান, তাদের জন্য আমাদের কোর্স একটি সঠিক ও নিরাপদ বিনিয়োগ।
          </p>

          <div className="text-center">
            <Link to="/courses">
              <Button size="lg" className="gradient-purple text-white font-bold text-lg px-8 py-6 hover:opacity-90 transition-all hover:scale-105">
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
