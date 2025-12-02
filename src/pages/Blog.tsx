import { Calendar, User } from "lucide-react";
import Navbar from "@/components/Navbar";
import TopBanner from "@/components/TopBanner";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import blogWordpressAutomation from "@/assets/blog-wordpress-automation.jpg";
import blogProgrammingHabits from "@/assets/blog-programming-habits.jpg";
import blogWebHosting from "@/assets/blog-web-hosting.jpg";
import blogCareerBreaking from "@/assets/blog-career-breaking.jpg";
import blogRemoteJobSkills from "@/assets/blog-remote-job-skills.jpg";
import blogWebDevFuture from "@/assets/blog-web-dev-future.jpg";

const Blog = () => {
  const blogPosts = [
    {
      id: 1,
      title: "Auto Blog Like a Pro: ChatGPT + n8n + WordPress = Magic!",
      excerpt: "আপনি যদি আপনার WordPress ওয়েবসাইট এ AI দিয়ে ব্লগ লিখাতে চান এবং ভাবেন প্রতিদিন AI আপনার জন্য একটা করে পোষ্ট করবে...",
      category: "Web Development",
      categoryColor: "bg-blue-500",
      image: blogWordpressAutomation,
      author: "An-Nur Academy",
      date: "June 27, 2025",
      link: "#",
    },
    {
      id: 2,
      title: "যে অভ্যাসগুলো আপনাকে ভালো প্রোগ্রামার বানাবে",
      excerpt: "আপনার কি কখনো এমন হয়েছে যে কোডিং শেখার পরেও মনে রাখতে পারছেন না? হয়তো কোনো একটা ফাংশন লিখতে গিয়ে থেমে যাচ্ছেন...",
      category: "Career Development",
      categoryColor: "bg-purple-500",
      image: blogProgrammingHabits,
      author: "An-Nur Academy",
      date: "December 11, 2024",
      link: "#",
    },
    {
      id: 3,
      title: "ওয়েব হোস্টিং এর ফাঁক ফোকর 🤔",
      excerpt: "আপনি যদি ওয়েব সাইট বানাতে চান আপনার অবশ্যই ভালো একটা হস্টিং প্রোভাইডার থেকে Web Host কিনতে হবে...",
      category: "Tips and Tricks",
      categoryColor: "bg-green-500",
      image: blogWebHosting,
      author: "An-Nur Academy",
      date: "November 12, 2024",
      link: "#",
    },
    {
      id: 4,
      title: "কিভাবে ধ্বংস করবেন আপনার ক্যারিয়ার?",
      excerpt: "আমার দীর্ঘ ১২+ বছরের ক্যারিয়ার কয়েকবার ধ্বংসের দ্বারপ্রান্তে পৌঁছেছিল, আমি শিক্ষা নিয়েছি এবং আবার ঘুরে দাঁড়িয়েছি...",
      category: "Career Development",
      categoryColor: "bg-purple-500",
      image: blogCareerBreaking,
      author: "An-Nur Academy",
      date: "November 10, 2024",
      link: "#",
    },
    {
      id: 5,
      title: "চাকরি দেয়ার সময় কোম্পানিগুলো কোন স্কিল দেখে?",
      excerpt: "আপনি কোড করতে জানেন একটা জব পাবার জন্য এতটুকুই যথেষ্ট না এর সাথে আপনার Problem solving Skill, communication...",
      category: "Remote Job",
      categoryColor: "bg-orange-500",
      image: blogRemoteJobSkills,
      author: "An-Nur Academy",
      date: "November 8, 2024",
      link: "#",
    },
    {
      id: 6,
      title: "ওয়েব ডেভেলপমেন্টের ভবিষ্যৎ কেমন?",
      excerpt: "GitHub co-pilot, ChatGPT, Open AI যে ভাবে এগিয়ে যাচ্ছে, ওয়েব ডেভেলপমেন্টের ক্যারিয়ার ধ্বংসের দিকে, আসলেই কি তাই?...",
      category: "Web Development",
      categoryColor: "bg-blue-500",
      image: blogWebDevFuture,
      author: "An-Nur Academy",
      date: "November 5, 2024",
      link: "#",
    },
  ];

  const categories = [
    "All",
    "Web Development",
    "Career Development",
    "Tips and Tricks",
    "Remote Job",
  ];

  return (
    <div className="min-h-screen bg-background">
      <TopBanner />
      <Navbar />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              আমাদের <span className="text-primary">ব্লগ</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              প্রোগ্রামিং, ওয়েব ডেভেলপমেন্ট এবং ক্যারিয়ার ডেভেলপমেন্ট নিয়ে সর্বশেষ টিপস এবং টিউটোরিয়াল
            </p>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {blogPosts.map((post, index) => (
              <article
                key={post.id}
                className="group bg-white rounded-2xl overflow-hidden border border-border hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Featured Image */}
                <a href={post.link} className="block relative overflow-hidden aspect-video">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </a>

                {/* Content */}
                <div className="p-6">
                  {/* Category Badge */}
                  <Badge
                    className={`${post.categoryColor} text-white mb-4 hover:opacity-90`}
                  >
                    {post.category}
                  </Badge>

                  {/* Title */}
                  <a href={post.link}>
                    <h2 className="text-xl font-bold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h2>
                  </a>

                  {/* Excerpt */}
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>

                  {/* Meta Info */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border pt-4">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{post.date}</span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Load More Button */}
          <div className="text-center mt-12">
            <button className="px-8 py-3 bg-primary text-white rounded-full font-semibold hover:opacity-90 transition-all hover:scale-105">
              আরও ব্লগ দেখুন
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Blog;
