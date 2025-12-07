import { Button } from "@/components/ui/button";
import { Youtube } from "lucide-react";

const WhySection = () => {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        {/* Main Content */}
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-5xl font-bold mb-4">কেন?</h2>
          <div className="flex items-center justify-center gap-2">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
              A
            </div>
            <div className="flex flex-col text-left">
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
      </div>
    </section>
  );
};

export default WhySection;
