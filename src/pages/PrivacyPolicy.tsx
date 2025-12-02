import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 via-background to-primary/5 py-8 md:py-12">
          <div className="container mx-auto px-4">
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>হোমে ফিরে যান</span>
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              প্রাইভেসি পলিসি
            </h1>
            <p className="text-lg text-muted-foreground">
              আপনার তথ্যের সুরক্ষা এবং গোপনীয়তা আমাদের অগ্রাধিকার
            </p>
          </div>
        </section>

        {/* Policy Content */}
        <section className="py-8 md:py-12">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="prose prose-lg max-w-none">
              
              {/* Introduction */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-foreground mb-4">ভূমিকা</h2>
                <p className="text-muted-foreground leading-relaxed">
                  An-Nur Academy ("আমরা", "আমাদের") আপনার গোপনীয়তা এবং ব্যক্তিগত তথ্যের সুরক্ষার প্রতি প্রতিশ্রুতিবদ্ধ। এই প্রাইভেসি পলিসি ব্যাখ্যা করে যে আমরা কীভাবে আপনার তথ্য সংগ্রহ, ব্যবহার, প্রকাশ এবং সুরক্ষিত করি যখন আপনি আমাদের ওয়েবসাইট এবং সেবা ব্যবহার করেন।
                </p>
                <p className="text-sm text-muted-foreground mt-4">
                  <strong>শেষ আপডেট:</strong> ডিসেম্বর ২০২৪
                </p>
              </div>

              {/* Information We Collect */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-foreground mb-4">আমরা যে তথ্য সংগ্রহ করি</h2>
                
                <div className="space-y-6">
                  <div className="bg-primary/5 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold text-foreground mb-3">ব্যক্তিগত তথ্য</h3>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                      <li>নাম এবং যোগাযোগের তথ্য (ইমেইল, ফোন নম্বর)</li>
                      <li>একাউন্ট লগইন তথ্য</li>
                      <li>পেমেন্ট এবং বিলিং তথ্য</li>
                      <li>প্রোফাইল তথ্য এবং ছবি</li>
                    </ul>
                  </div>

                  <div className="bg-accent/5 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold text-foreground mb-3">ব্যবহার সংক্রান্ত তথ্য</h3>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                      <li>কোর্স এনরোলমেন্ট এবং প্রগ্রেস</li>
                      <li>ভিডিও দেখার ইতিহাস এবং সময়</li>
                      <li>কুইজ এবং অ্যাসাইনমেন্ট স্কোর</li>
                      <li>ওয়েবসাইট ব্রাউজিং প্যাটার্ন</li>
                    </ul>
                  </div>

                  <div className="bg-secondary/5 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold text-foreground mb-3">প্রযুক্তিগত তথ্য</h3>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                      <li>IP অ্যাড্রেস এবং ডিভাইস তথ্য</li>
                      <li>ব্রাউজার টাইপ এবং ভার্সন</li>
                      <li>কুকিজ এবং অনুরূপ ট্র্যাকিং প্রযুক্তি</li>
                      <li>লোকেশন ডেটা (যদি অনুমতি দেওয়া হয়)</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* How We Use Information */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-foreground mb-4">আমরা তথ্য কীভাবে ব্যবহার করি</h2>
                <ul className="list-disc pl-6 space-y-3 text-muted-foreground">
                  <li>
                    <strong>সেবা প্রদান:</strong> কোর্স অ্যাক্সেস, প্রগ্রেস ট্র্যাকিং এবং সার্টিফিকেট প্রদান
                  </li>
                  <li>
                    <strong>যোগাযোগ:</strong> কোর্স আপডেট, নোটিফিকেশন এবং সাপোর্ট মেসেজ পাঠানো
                  </li>
                  <li>
                    <strong>উন্নতি:</strong> আমাদের সেবা এবং ব্যবহারকারী অভিজ্ঞতা উন্নত করা
                  </li>
                  <li>
                    <strong>নিরাপত্তা:</strong> জালিয়াতি প্রতিরোধ এবং নিরাপত্তা বজায় রাখা
                  </li>
                  <li>
                    <strong>বিশ্লেষণ:</strong> ব্যবহার প্যাটার্ন বুঝতে এবং কন্টেন্ট উন্নত করতে
                  </li>
                  <li>
                    <strong>মার্কেটিং:</strong> প্রাসঙ্গিক অফার এবং আপডেট পাঠানো (আপনি অপ্ট-আউট করতে পারেন)
                  </li>
                </ul>
              </div>

              {/* Data Sharing */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-foreground mb-4">তথ্য শেয়ারিং</h2>
                <p className="text-muted-foreground mb-4">
                  আমরা আপনার ব্যক্তিগত তথ্য বিক্রয় করি না। তবে নিম্নলিখিত ক্ষেত্রে তথ্য শেয়ার করতে পারি:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li><strong>সেবা প্রদানকারী:</strong> পেমেন্ট প্রসেসর, হোস্টিং প্রদানকারী</li>
                  <li><strong>আইনি প্রয়োজন:</strong> আইন মেনে চলতে বা আইনি প্রক্রিয়ায়</li>
                  <li><strong>ব্যবসায়িক স্থানান্তর:</strong> একীভূতকরণ বা অধিগ্রহণের ক্ষেত্রে</li>
                  <li><strong>আপনার সম্মতিতে:</strong> আপনি স্পষ্টভাবে অনুমতি দিলে</li>
                </ul>
              </div>

              {/* Data Security */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-foreground mb-4">তথ্য সুরক্ষা</h2>
                <div className="bg-primary/5 p-6 rounded-lg">
                  <p className="text-muted-foreground mb-4">
                    আমরা আপনার তথ্য সুরক্ষিত রাখতে শিল্প-মান নিরাপত্তা ব্যবস্থা ব্যবহার করি:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>SSL/TLS এনক্রিপশন</li>
                    <li>নিরাপদ ডেটাবেস স্টোরেজ</li>
                    <li>নিয়মিত নিরাপত্তা অডিট</li>
                    <li>সীমিত কর্মচারী অ্যাক্সেস</li>
                    <li>নিয়মিত ব্যাকআপ</li>
                  </ul>
                </div>
              </div>

              {/* Your Rights */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-foreground mb-4">আপনার অধিকার</h2>
                <p className="text-muted-foreground mb-4">
                  আপনার ব্যক্তিগত তথ্যের বিষয়ে আপনার নিম্নলিখিত অধিকার রয়েছে:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-accent/5 p-4 rounded-lg">
                    <h4 className="font-semibold text-foreground mb-2">অ্যাক্সেস</h4>
                    <p className="text-sm text-muted-foreground">আপনার সংরক্ষিত তথ্য দেখার অধিকার</p>
                  </div>
                  <div className="bg-accent/5 p-4 rounded-lg">
                    <h4 className="font-semibold text-foreground mb-2">সংশোধন</h4>
                    <p className="text-sm text-muted-foreground">ভুল তথ্য সংশোধন করার অধিকার</p>
                  </div>
                  <div className="bg-accent/5 p-4 rounded-lg">
                    <h4 className="font-semibold text-foreground mb-2">মুছে ফেলা</h4>
                    <p className="text-sm text-muted-foreground">আপনার তথ্য মুছে ফেলার অধিকার</p>
                  </div>
                  <div className="bg-accent/5 p-4 rounded-lg">
                    <h4 className="font-semibold text-foreground mb-2">অপ্ট-আউট</h4>
                    <p className="text-sm text-muted-foreground">মার্কেটিং কমিউনিকেশন থেকে বের হওয়ার অধিকার</p>
                  </div>
                </div>
              </div>

              {/* Cookies */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-foreground mb-4">কুকিজ</h2>
                <p className="text-muted-foreground mb-4">
                  আমরা আপনার ব্রাউজিং অভিজ্ঞতা উন্নত করতে এবং ওয়েবসাইট ব্যবহার বিশ্লেষণ করতে কুকিজ ব্যবহার করি। আপনি আপনার ব্রাউজার সেটিংসে কুকিজ নিয়ন্ত্রণ করতে পারেন।
                </p>
              </div>

              {/* Children's Privacy */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-foreground mb-4">শিশুদের গোপনীয়তা</h2>
                <p className="text-muted-foreground">
                  আমাদের সেবা ১৮ বছর বয়সের কম ব্যক্তিদের জন্য নয়। আমরা ইচ্ছাকৃতভাবে শিশুদের কাছ থেকে ব্যক্তিগত তথ্য সংগ্রহ করি না।
                </p>
              </div>

              {/* Policy Changes */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-foreground mb-4">পলিসি পরিবর্তন</h2>
                <p className="text-muted-foreground">
                  আমরা সময়ে সময়ে এই প্রাইভেসি পলিসি আপডেট করতে পারি। উল্লেখযোগ্য পরিবর্তনের ক্ষেত্রে আমরা আপনাকে ইমেইলের মাধ্যমে অবহিত করব।
                </p>
              </div>

              {/* Contact Information */}
              <div className="bg-primary/5 p-8 rounded-lg">
                <h2 className="text-2xl font-bold text-foreground mb-4">যোগাযোগ</h2>
                <p className="text-muted-foreground mb-4">
                  প্রাইভেসি সম্পর্কিত কোন প্রশ্ন বা উদ্বেগের জন্য:
                </p>
                <div className="space-y-2 text-muted-foreground">
                  <p><strong>ইমেইল:</strong> support@annuracademy.com</p>
                  <p><strong>টেলিগ্রাম:</strong> @annuracademy</p>
                  <p><strong>ফেসবুক:</strong> @annuracademy</p>
                </div>
              </div>

            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;