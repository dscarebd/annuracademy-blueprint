import { useParams, Link } from "react-router-dom";
import TopBanner from "@/components/TopBanner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBlog } from "@/hooks/useBlogs";
import { format } from "date-fns";

const BlogDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: blog, isLoading, error } = useBlog(id || "");

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <TopBanner />
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <TopBanner />
        <Navbar />
        <main className="flex-grow flex flex-col items-center justify-center gap-4">
          <p className="text-destructive text-lg">ব্লগ পোস্ট পাওয়া যায়নি</p>
          <Link to="/blog">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              সব ব্লগ দেখুন
            </Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <TopBanner />
      <Navbar />

      <main className="flex-grow">
        {/* Back Link */}
        <div className="container mx-auto px-4 py-4">
          <Link to="/blog" className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            সব ব্লগ
          </Link>
        </div>

        {/* Hero Image */}
        <div className="w-full h-64 md:h-96 overflow-hidden">
          <img
            src={blog.image_url || ''}
            alt={blog.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <article className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Category Badge */}
          <Badge
            className={`${blog.category_color || 'bg-blue-500'} text-white mb-4`}
          >
            {blog.category}
          </Badge>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            {blog.title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-6 text-muted-foreground mb-8 pb-8 border-b border-border">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5" />
              <span>{blog.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>
                {blog.published_at
                  ? format(new Date(blog.published_at), "MMMM d, yyyy")
                  : ""}
              </span>
            </div>
          </div>

          {/* Excerpt */}
          {blog.excerpt && (
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              {blog.excerpt}
            </p>
          )}

          {/* Content */}
          {blog.content && (
            <div className="prose prose-lg max-w-none text-foreground">
              <div className="whitespace-pre-wrap">{blog.content}</div>
            </div>
          )}

          {/* External Link */}
          {blog.link && (
            <div className="mt-8 pt-8 border-t border-border">
              <a
                href={blog.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-primary hover:underline"
              >
                আরও পড়ুন →
              </a>
            </div>
          )}
        </article>
      </main>

      <Footer />
    </div>
  );
};

export default BlogDetail;
