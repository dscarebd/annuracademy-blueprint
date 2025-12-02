import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const RefundPolicy = () => {
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
              রিফান্ড পলিসি
            </h1>
            <p className="text-lg text-muted-foreground">
              An-Nur Academy এর রিফান্ড নীতি সম্পর্কে বিস্তারিত জানুন
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
                  An-Nur Academy আপনার বিশ্বাস এবং সন্তুষ্টিকে অত্যন্ত গুরুত্ব দেয়। আমরা বুঝি যে কখনো কখনো পরিস্থিতি পরিবর্তন হতে পারে এবং একটি কোর্স আপনার প্রত্যাশা পূরণ নাও করতে পারে। এই কারণে আমরা একটি স্পষ্ট এবং ন্যায্য রিফান্ড পলিসি প্রদান করি।
                </p>
              </div>

              {/* Refund Eligibility */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-foreground mb-4">রিফান্ডের যোগ্যতা</h2>
                <div className="space-y-4">
                  <div className="bg-primary/5 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold text-foreground mb-3">৭ দিনের মানি-ব্যাক গ্যারান্টি</h3>
                    <p className="text-muted-foreground">
                      কোর্স ক্রয়ের পর ৭ দিনের মধ্যে যদি আপনি কোর্স সম্পর্কে অসন্তুষ্ট হন, তাহলে আপনি সম্পূর্ণ রিফান্ড পাওয়ার যোগ্য। তবে, কোর্সের ৩০% এর বেশি কন্টেন্ট দেখা হলে রিফান্ডের আবেদন প্রত্যাখ্যান হতে পারে।
                    </p>
                  </div>

                  <div className="bg-accent/5 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold text-foreground mb-3">টেকনিক্যাল সমস্যা</h3>
                    <p className="text-muted-foreground">
                      যদি আপনি কোর্স অ্যাক্সেস করতে টেকনিক্যাল সমস্যায় পড়েন এবং আমাদের সাপোর্ট টিম ৪৮ ঘন্টার মধ্যে সমাধান করতে না পারে, তাহলে আপনি সম্পূর্ণ রিফান্ড পাওয়ার যোগ্য।
                    </p>
                  </div>
                </div>
              </div>

              {/* Non-Refundable Cases */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-foreground mb-4">রিফান্ড প্রযোজ্য নয় যেসব ক্ষেত্রে</h2>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>কোর্স কেনার ৭ দিন পার হয়ে গেলে</li>
                  <li>কোর্সের ৩০% এর বেশি কন্টেন্ট দেখা হলে</li>
                  <li>কোর্স সম্পূর্ণ করার পরে সার্টিফিকেট ডাউনলোড করা হলে</li>
                  <li>কোর্স ম্যাটেরিয়াল শেয়ার বা কপি করার চেষ্টা পাওয়া গেলে</li>
                  <li>অফার বা ডিসকাউন্ট মূল্যে কেনা কোর্সের ক্ষেত্রে (বিশেষ শর্ত প্রযোজ্য)</li>
                </ul>
              </div>

              {/* Refund Process */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-foreground mb-4">রিফান্ড প্রক্রিয়া</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">ধাপ ১: আবেদন করুন</h3>
                    <p className="text-muted-foreground">
                      support@annuracademy.com এ একটি ইমেল পাঠান অথবা আমাদের সাপোর্ট টিমের সাথে যোগাযোগ করুন। আপনার অর্ডার নম্বর এবং রিফান্ডের কারণ উল্লেখ করুন।
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">ধাপ ২: যাচাই</h3>
                    <p className="text-muted-foreground">
                      আমাদের টিম ২৪-৪৮ ঘন্টার মধ্যে আপনার আবেদন পর্যালোচনা করবে এবং যোগ্যতা যাচাই করবে।
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">ধাপ ৩: প্রসেসিং</h3>
                    <p className="text-muted-foreground">
                      অনুমোদিত হলে, রিফান্ড ৫-৭ কার্যদিবসের মধ্যে আপনার অরিজিনাল পেমেন্ট মেথডে ফেরত পাঠানো হবে।
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-primary/5 p-8 rounded-lg">
                <h2 className="text-2xl font-bold text-foreground mb-4">যোগাযোগ</h2>
                <p className="text-muted-foreground mb-4">
                  রিফান্ড সম্পর্কিত কোন প্রশ্ন বা সমস্যার জন্য:
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

export default RefundPolicy;