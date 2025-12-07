import { Card } from "@/components/ui/card";
import { PenTool, BarChart3, Award } from "lucide-react";

const CourseFeaturesSection = () => {
  const features = [
    {
      icon: PenTool,
      title: "প্রোজেক্ট ভিত্তিক স্টাডি",
      description: "শুধু থিওরি নয়, প্রতিটি কোর্সে রয়েছে বাস্তব প্রোজেক্ট। হাতে-কলমে কাজ করে শিখুন এবং নিজের পোর্টফোলিও তৈরি করুন যা আপনাকে চাকরি বা ফ্রিল্যান্সিংয়ে এগিয়ে রাখবে।",
    },
    {
      icon: BarChart3,
      title: "নিয়মিত মেথডস মাস্টারিং",
      description: "প্রতিটি বিষয় ধাপে ধাপে শেখানো হয় যাতে আপনি সহজেই বুঝতে পারেন। নিয়মিত প্র্যাকটিস এবং রিভিশনের মাধ্যমে দক্ষতা অর্জন করুন এবং নিজের গতিতে এগিয়ে যান।",
    },
    {
      icon: Award,
      title: "শিখুন মার্কেট এক্সপার্ট থেকে",
      description: "অভিজ্ঞ ইনস্ট্রাক্টরদের কাছ থেকে শিখুন যারা বাস্তব মার্কেটে কাজ করেছেন। তাদের অভিজ্ঞতা এবং টিপস থেকে শিখে নিজেকে প্রফেশনাল হিসেবে গড়ে তুলুন।",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Heading */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            কোর্সে কি <span className="text-gradient">কি পাবেন?</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            দেখে নিন কি কি ব্যাকড্রস প্যাকেজে কোর্সের জন্য কনবে
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="p-8 text-center hover:shadow-xl transition-all duration-300 bg-white"
            >
              {/* Icon with 2 Layers */}
              <div className="mx-auto mb-6 w-36 h-36 rounded-full border-4 border-dashed border-primary/40 flex items-center justify-center">
                <div className="w-28 h-28 rounded-full bg-purple-100 flex items-center justify-center">
                  <feature.icon className="w-12 h-12 text-primary" strokeWidth={2} />
                </div>
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold mb-4">{feature.title}</h3>

              {/* Description */}
              <p className="text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CourseFeaturesSection;
