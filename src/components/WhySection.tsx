const WhySection = () => {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Left Card */}
          <div className="bg-gradient-to-r from-purple-500 to-purple-400 rounded-2xl p-12 flex items-center justify-center text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white leading-relaxed">
              লাখ টাকা আয়ের স্বপ্নে বিভোর না হয়ে
              <br />
              স্কিল ডেভেলপ করে নিজের স্বপ্ন সত্যি করুন
            </h2>
          </div>

          {/* Right Card */}
          <div className="bg-card border border-border rounded-2xl p-8 space-y-4">
            <h3 className="text-3xl font-bold text-foreground">কেন?</h3>
            <div className="flex items-center gap-2">
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
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhySection;
