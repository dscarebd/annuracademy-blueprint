import { Calendar, User, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import TopBanner from "@/components/TopBanner";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { useBlogs } from "@/hooks/useBlogs";
import { format } from "date-fns";

const Blog = () => {
  const { data: blogPosts, isLoading, error } = useBlogs();

  return (
    <div className="min-h-screen bg-background">
      <TopBanner />
      <Navbar />

      {/* Hero Section */}
      <section className="py-12 bg-gradient-to-b from-primary/5 to-background">
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
      <section className="py-12">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center py-12 text-destructive">
              ব্লগ লোড করতে সমস্যা হয়েছে
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {blogPosts?.map((post, index) => (
                <article
                  key={post.id}
                  className="group bg-white rounded-2xl overflow-hidden border border-border hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Featured Image */}
                  <a href={post.link || "#"} className="block relative overflow-hidden aspect-video">
                    <img
                      src={post.image_url || ''}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </a>

                  {/* Content */}
                  <div className="p-6">
                    {/* Category Badge */}
                    <Badge
                      className={`${post.category_color || 'bg-blue-500'} text-white mb-4 hover:opacity-90`}
                    >
                      {post.category}
                    </Badge>

                    {/* Title */}
                    <a href={post.link || "#"}>
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
                        <span>
                          {post.published_at 
                            ? format(new Date(post.published_at), "MMMM d, yyyy")
                            : ""}
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Blog;
