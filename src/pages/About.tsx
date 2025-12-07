import { Youtube } from "lucide-react";
import Navbar from "@/components/Navbar";
import TopBanner from "@/components/TopBanner";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const About = () => {

  return (
    <div className="min-h-screen bg-background">
      <TopBanner />
      <Navbar />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              আমার সম্পর্কে <span className="text-primary">কিছু কথা</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              কে, কেন, কিভাবে?
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            {/* Image Section */}
            <div className="relative animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="/placeholder.svg"
                  alt="Instructor"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              </div>
            </div>

            {/* Text Section */}
            <div className="space-y-6 animate-fade-in" style={{ animationDelay: "0.4s" }}>
              <div className="border-l-4 border-primary pl-6">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  আমি একজন ওয়েব ডেভেলপার, দীর্ঘদিন ফ্রিল্যান্সিং করছি টপ মার্কেটপ্লেস, যেমন Fiverr আর Upwork-এ। এমনকি Upwork-এ আমি ছিলাম টপ রেটেড ফ্রিল্যান্সার। এরপর যুক্ত হই একটি আমেরিকান কোম্পানির রিমোট জবের জন্য।
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed mt-4">
                  প্রোগ্রামিং আর ওয়েব ডেভেলপমেন্ট শেখা আমার জন্য সবসময়ই এক ধরনের ভালো লাগার বিষয়। আর সেই ভালো লাগা থেকেই ২০১৯ সালে শুরু করি YouTube চ্যানেল। এখন সেখানে ৬২৫টিরও বেশি ভিডিও রয়েছে, যেগুলো লক্ষ লক্ষ লার্নারকে প্রতিদিন সহায়তা করছে।
                </p>
              </div>

              <div className="bg-primary/5 rounded-xl p-6 border-l-4 border-primary">
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  An-Nur Academy
                </h3>
                <p className="text-muted-foreground mb-1">
                  ওয়েব ডেভেলপার, শিক্ষক
                </p>
                <p className="text-sm text-primary font-semibold">
                  Founder & CEO - An-Nur Academy
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  ট্রেড লাইসেন্স : TRAD/DNCC/002347/2025
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
            আমার YouTube চ্যানেলে এখন পর্যন্ত ৬২৫টির বেশি ভিডিও আছে। দেশ-বিদেশের অসংখ্য মানুষ এই ভিডিওগুলো দেখে উপকৃত হয়েছে। ক্যারিয়ার ডেভেলপমেন্ট নিয়ে কথা বললে, লার্নাররা বলছে—এই ভিডিও আর প্লেলিস্টগুলো যেন একেকটা আলোর বাতি। প্রোগ্রামিংয়ের জটিল সব বিষয় সহজ ভাষায় শেখানোর জন্য হাজার হাজার লার্নারের প্রথম পছন্দ আমার চ্যানেল।
          </p>

          <div className="text-center">
            <a
              href="https://www.youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block"
            >
              <Button size="lg" className="gradient-purple text-white font-bold text-lg px-8 py-6 hover:opacity-90 transition-all hover:scale-105">
                <Youtube className="w-6 h-6 mr-2" />
                YouTube Channel দেখুন
              </Button>
            </a>
          </div>
        </div>
      </section>


      <Footer />
    </div>
  );
};

export default About;
