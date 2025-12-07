import { useSiteContentMultiple, getContentValue } from "@/hooks/useSiteContent";

const WhySection = () => {
  const { data: content } = useSiteContentMultiple([
    "why_left_heading",
    "why_right_heading", 
    "why_brand_name",
    "why_brand_tagline",
    "why_description"
  ]);

  const leftHeading = getContentValue(content, "why_left_heading", "লাখ টাকা আয়ের স্বপ্নে বিভোর না হয়ে\nস্কিল ডেভেলপ করে নিজের স্বপ্ন সত্যি করুন");
  const rightHeading = getContentValue(content, "why_right_heading", "কেন?");
  const brandName = getContentValue(content, "why_brand_name", "An-Nur");
  const brandTagline = getContentValue(content, "why_brand_tagline", "ACADEMY");
  const description = getContentValue(content, "why_description", "শিক্ষার্থীরা আমাদের কোর্স কিনে কারণ আমরা শেখাই একদম সহজভাবে, ধাপে ধাপে এবং বাস্তবে কাজে লাগে এমন স্কিল।");

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Left Card */}
          <div className="bg-gradient-to-r from-purple-500 to-purple-400 rounded-2xl p-12 flex items-center justify-center text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white leading-relaxed whitespace-pre-line">
              {leftHeading}
            </h2>
          </div>

          {/* Right Card */}
          <div className="bg-card border border-border rounded-2xl p-8 space-y-4">
            <h3 className="text-3xl font-bold text-foreground">{rightHeading}</h3>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                A
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xl font-bold text-foreground">{brandName}</span>
                <span className="text-xs text-primary font-semibold">{brandTagline}</span>
              </div>
            </div>
            <p className="text-base leading-relaxed text-muted-foreground">
              {description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhySection;
