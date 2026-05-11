import { Card } from "@/components/ui/card";
import { Brain, TrendingUp, Briefcase, Clock, Globe, Sparkles } from "lucide-react";

const CourseFeaturesSection = () => {
  const features = [
    {
      icon: Brain,
      title: "ভবিষ্যতের স্কিল",
      description: "AI আজকের সবচেয়ে demanding skill! এখনই শুরু করলে আপনি early adopter হিসেবে এগিয়ে থাকবেন।",
    },
    {
      icon: TrendingUp,
      title: "ক্যারিয়ার গ্রোথ",
      description: "AI জানা professional-দের salary ও opportunity অন্যদের তুলনায় অনেক বেশি।",
    },
    {
      icon: Briefcase,
      title: "নতুন ব্যবসার সুযোগ",
      description: "AI দিয়ে কম খরচে ও দ্রুত নিজের startup, agency বা freelancing business দাঁড় করানো যায়।",
    },
    {
      icon: Clock,
      title: "১০x দ্রুত কাজ",
      description: "যে কাজ আগে দিনে হতো, AI দিয়ে তা ঘণ্টায় শেষ — productivity বহুগুণ বাড়ান।",
    },
    {
      icon: Globe,
      title: "গ্লোবাল মার্কেটে এন্ট্রি",
      description: "AI tools দিয়ে international client ও marketplace-এ সহজে কাজ করার সুযোগ পাবেন।",
    },
    {
      icon: Sparkles,
      title: "সৃজনশীলতা বৃদ্ধি",
      description: "AI আপনার creativity-কে boost দেয় — content, design, code সব কিছুতে নতুন মাত্রা যোগ করে।",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Heading */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            কেন আপনার <span className="text-gradient">AI শেখা দরকার?</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            পৃথিবী দ্রুত বদলাচ্ছে — যারা AI জানে, তারাই সামনে এগিয়ে থাকবে
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="p-5 text-center hover:shadow-lg transition-all duration-300 bg-white"
            >
              {/* Icon with 2 Layers */}
              <div className="mx-auto mb-4 w-20 h-20 rounded-full border-2 border-dashed border-primary/40 flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center">
                  <feature.icon className="w-6 h-6 text-primary" strokeWidth={2} />
                </div>
              </div>

              {/* Title */}
              <h3 className="text-base font-bold mb-2">{feature.title}</h3>

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
