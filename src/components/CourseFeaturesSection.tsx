import { Card } from "@/components/ui/card";
import { PenTool, BarChart3, Award } from "lucide-react";

const CourseFeaturesSection = () => {
  const features = [
    {
      icon: PenTool,
      title: "প্রোজেক্ট ভিত্তিক স্টাডি",
      description: "যে কোনো বিষয় শিখতে গেলে আমি সবসময় ফ্যানওসলগনের ওপর ভোর দিয় বিষি ভাই পরেন না হয়, তাহলে বট কিছু গড়ে এটা একদম ঠিক এইডউলা আমাদের পিঙ্গবোনা। এবারই ফ্যান্টাস্টিং মাথফুট কনভার, তাবছেট রোজেস্টেড মায়ধান ধল দাষ দাশ প্রসিদ্ধ তৈরি হবছো মাতো—তিরিত পছ হলে ভবন নাতিবাচ্য বয়ল ধিনেন থিনেদ্ধ জানা।",
    },
    {
      icon: BarChart3,
      title: "নিয়মিতএমএর মেথডস মাস্টারিং",
      description: "আমাদি কতোট্টুকই কাজে শিখবেছেন, কতোট্টুকই থেবার বারি, আমি কবেব কোনো শোল দিবাহপা—মদক্রিতিয়েই এবার থ্যাবদার আভবানির মাজের মাঝনান নিয়মিতএমএর ডিমেশনবৈদ একি নতবার কোনতে পবারবো সবদিতি কেন নিজেও পেথার পারাব আমাদি নিজেও নিদ্ধগ্ধা, এক পৃষ্ঠা থেকে আরক পৃষ্ঠায় প্রতিলো হলেযমই।",
    },
    {
      icon: Award,
      title: "শিখুন মার্কেট এক্সপার্ট থেকে",
      description: "১২ বছরের বেশি সময় ধরে আমি প্রথম ডেভেলপার হিসেবে কাজ করছি। কালের প্রতিটি শুর্ট কিম শ্যোযারা এবং আই্ভরালের পরলা পেশ্ন কারেলে আইভোটাও থেকেই এমন আশনাকে পোখানো—যা শপ্ড তুবু নম, বুশক স্থাওকদনমারা প্রমাণের ডোভার বলেছে। ধার মেভে থেরে আমার স্টডেন্ট এক্সপার্ট কাজে কনাটি, এমইই ট্যাইনেল নেয়া।",
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
