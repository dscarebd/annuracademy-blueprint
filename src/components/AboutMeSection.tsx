import instructorImage from "@/assets/instructor-about.jpg";

const AboutMeSection = () => {
  // All editable content
  const content = {
    heading: "আমার সম্পর্কে",
    headingHighlight: "কিছু কথা",
    subtitle: "কে, কেন, কিভাবে?",
    
    bio1: "আমি নুর আল-আমীন—একজন প্যাশনেট ওয়ার্ডপ্রেস ডিজাইনার, ডিজিটাল স্কিল (আই আউটো মেশন) ইনস্ট্রাক্টর এবং An-Nur Academy-এর প্রতিষ্ঠাতা। গত কয়েক বছর ধরে আমি বিশ্বব্যাপী ক্লায়েন্টদের সাথে কাজ করে বিভিন্ন টেক-বেইজড প্রজেক্ট সফলভাবে সম্পন্ন করেছি। যেখানে আমি শত শত ক্লায়েন্টকে ওয়েব ডিজাইন সার্ভিস দিয়ে সহায়তা করেছি।",
    
    bio2: "টেকনোলজি শেখার প্রতি আমার আগ্রহ থেকেই আমি নতুন নতুন স্কিল শেখা এবং অন্যদের শেখাতে ভালোবাসি। এজন্যই আমি তৈরি করেছি An-Nur Academy, যেখানে শিক্ষার্থীরা সহজ ভাষায় কোডিং, এআই অটোমেশন, চ্যাটজিপিটি মাস্টারক্লাস সহ আধুনিক স্কিল শিখতে পারবে।",
    
    
    
    name: "নুর আল-আমীন",
    title: "ওয়ার্ডপ্রেস ডিজাইনার, ইনস্ট্রাক্টর",
    role: "Founder & CEO - An-Nur Academy",
  };

  return (
    <section className="py-16 md:py-24 bg-white">
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
                <p className="text-sm font-medium text-foreground">
                  {content.role}
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
