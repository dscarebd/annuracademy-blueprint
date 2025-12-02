import instructorImage from "@/assets/instructor-about.jpg";

const AboutMeSection = () => {
  // All editable content
  const content = {
    heading: "আমার সম্পর্কে",
    headingHighlight: "কিছু কথা",
    subtitle: "কে, কেন, কিভাবে?",
    
    bio1: "আমি আলী হোসেন একজন প্রথম ডেভেলপার, দীর্ঘদিন ফ্রিল্যান্সিং করছি টপ মার্কেটপ্লেস, যেমন Fiverr আর Upwork এ। এমনকি Upwork এ আমি ছিলাম টপ রেটেড ফ্রিল্যান্সার। এবসসময় যুক্ত ছই একটি আমেরিকান কোম্পানির রিমোট জবের জন্য।",
    
    bio2: "প্রোগ্রামিং আর ওয়েব ডেভেলপমেন্টে খেলা আমার জন্য সবসময়ই এক ধরনের ভালো লাগার বিষয়। আমি সেই ভালো লাগা থেকেই ২০১৯ সালে শুরু করি Procoder BD নামে একটি YouTube চ্যানেল। এখন সেখানে ৬২৬টিরও বেশি ভিডিও রয়েছে, যেখলো লক্ষ লক্ষ লার্নারকে প্রতিদিন সাহায্য করছে।",
    
    name: "আলী হোসেন",
    title: "প্রথম ডেভেলপার, শিক্ষক",
    role: "Founder & CEO - An-Nur Academy",
    tradeLicense: "ট্রেড লাইসেন্স: TRAD/DNCC/002347/2025",
  };

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Heading */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            {content.heading} <span className="text-gradient">{content.headingHighlight}</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            {content.subtitle}
          </p>
        </div>

        {/* Main Content - Image and Text */}
        <div className="flex flex-col lg:flex-row gap-12 items-center max-w-5xl mx-auto">
          {/* Left Side - Instructor Image */}
          <div className="lg:w-[45%]">
            <div className="relative">
              <img
                src={instructorImage}
                alt={content.name}
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
            </div>
          </div>

          {/* Right Side - Bio Text with Purple Border */}
          <div className="lg:w-[55%] relative">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
            <div className="pl-8 space-y-6">
              <p className="text-base leading-relaxed text-muted-foreground">
                {content.bio1}
              </p>
              <p className="text-base leading-relaxed text-muted-foreground">
                {content.bio2}
              </p>
              
              {/* Name and Title */}
              <div className="pt-4">
                <h3 className="text-2xl font-bold text-primary mb-2">
                  {content.name}
                </h3>
                <p className="text-base font-semibold text-foreground mb-1">
                  {content.title}
                </p>
                <p className="text-sm font-medium text-foreground mb-1">
                  {content.role}
                </p>
                <p className="text-xs text-muted-foreground">
                  {content.tradeLicense}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutMeSection;
