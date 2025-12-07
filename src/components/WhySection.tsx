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
              শিক্ষার্থীরা আমাদের কোর্স কিনে কারণ আমরা শেখাই একদম সহজভাবে, ধাপে ধাপে এবং বাস্তবে কাজে লাগে এমন স্কিল। এখানে অযথা জটিল তত্ত্ব নেই—বরং যা শিখবেন, তা সরাসরি নিজের কাজ, ক্যারিয়ার বা ফ্রিল্যান্সিংয়ে ব্যবহার করতে পারবেন। প্রতিটি কোর্স নতুনদের কথা ভেবেই তৈরি, যাতে যেকোনো শিক্ষার্থী খুব সহজে শুরু করতে পারে এবং নিশ্চিতভাবে অগ্রগতি দেখতে পায়। আমরা শুধু কোর্স দিই না—শেখার সময় যেকোনো সমস্যায় পাশে থাকার প্রতিশ্রুতিও দিই। তাই যারা সত্যি স্কিল শিখে সামনে এগোতে চান, তাদের জন্য আমাদের কোর্স একটি সঠিক ও নিরাপদ বিনিয়োগ।
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhySection;
