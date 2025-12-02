import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Youtube, Users, Eye, Video } from "lucide-react";
import videoWpTheme from "@/assets/video-wp-theme.jpg";
import videoRemoteJob from "@/assets/video-remote-job.jpg";
import videoFreelancer from "@/assets/video-freelancer.jpg";

const WhySection = () => {
  const videos = [
    {
      title: "WP Theme Development",
      thumbnail: videoWpTheme,
      label: "ভিডিও দেখুন",
    },
    {
      title: "Remote Job Guideline",
      thumbnail: videoRemoteJob,
      label: "ভিডিও দেখুন",
    },
    {
      title: "Freelancer Guidelines",
      thumbnail: videoFreelancer,
      label: "ভিডিও দেখুন",
    },
  ];

  const stats = [
    {
      label: "Total Fans / Subscribers",
      value: "321000",
      icon: Users,
    },
    {
      label: "Total Youtube Views",
      value: "22449339",
      icon: Eye,
    },
    {
      label: "Video Uploads",
      value: "782",
      icon: Video,
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Main Content - Text Left, Videos Right */}
        <div className="flex flex-col lg:flex-row gap-8 mb-16">
          {/* Left Side - Text Content (40%) */}
          <div className="lg:w-[40%] space-y-6">
            <h2 className="text-5xl font-bold mb-4">কেন?</h2>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                A
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-foreground">An-Nur</span>
                <span className="text-xs text-primary font-semibold">ACADEMY</span>
              </div>
            </div>
            <p className="text-base leading-relaxed text-muted-foreground">
              আমার চ্যানেলে এখন পর্যন্ত ৭০০ টির বেশি ভিডিও আছে। দেশ-বিদেশের অসংখ্য মানুষ এই ভিডিওগুলো দেখে উপকৃত হয়েছে। ক্যারিয়ার ডেভেলপমেন্টে নিয়ে কথা বলেছি, লার্নিং রিলেটেড—এই ভিডিও আমি প্রতিটিতে ফেল প্রেকটিক্যাল আলোর বাতি। প্রোগ্রামিং জার্নিসে বিষয়ে সহজ ভাষায় সবকিছু জানা যাবার হাজার হাজার মানুষকে ফ্রি শেখাতে আমার ইউটিউবের চ্যানেলা পেয়ার এখন সহজ-সুন্দর পথ খেঁজে পাওয়া যায় না।
            </p>
            <Button className="gradient-purple text-white hover:opacity-90 gap-2 px-6 py-6">
              <Youtube className="w-5 h-5" />
              YouTube Channel
            </Button>
          </div>

          {/* Right Side - Video Cards (60%) */}
          <div className="lg:w-[60%] grid grid-cols-1 md:grid-cols-3 gap-6">
            {videos.map((video, index) => (
              <Card
                key={index}
                className="group overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 bg-white"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Youtube className="w-16 h-16 text-white" />
                  </div>
                </div>
                <div className="p-5 text-center">
                  <h3 className="font-bold text-lg mb-3">{video.title}</h3>
                  <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                    <Youtube className="w-4 h-4" />
                    {video.label}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Statistics Cards - Full Width Below */}
        <div className="grid md:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="gradient-purple text-white p-8 hover:scale-105 transition-transform duration-300 rounded-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-base font-medium opacity-90">{stat.label}</span>
                <stat.icon className="w-8 h-8 opacity-80" />
              </div>
              <div className="text-5xl font-bold">{stat.value}</div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhySection;
