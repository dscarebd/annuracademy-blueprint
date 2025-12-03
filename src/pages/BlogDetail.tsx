import { useParams, Link } from "react-router-dom";
import TopBanner from "@/components/TopBanner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, User, Loader2, ArrowLeft, Facebook, Youtube, BookOpen, Send, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBlogBySlug } from "@/hooks/useBlogs";
import { useCourses } from "@/hooks/useCourses";
import { format } from "date-fns";

const BlogDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: blog, isLoading, error } = useBlogBySlug(slug || "");
  const { data: courses } = useCourses();

  const popularCourses = courses?.slice(0, 5) || [];

  const socialLinks = [
    { name: "Facebook", icon: Facebook, url: "https://facebook.com", color: "bg-blue-600 hover:bg-blue-700" },
    { name: "Telegram", icon: Send, url: "https://t.me", color: "bg-sky-500 hover:bg-sky-600" },
    { name: "YouTube", icon: Youtube, url: "https://youtube.com", color: "bg-red-600 hover:bg-red-700" },
    { name: "Email", icon: Mail, url: "mailto:contact@example.com", color: "bg-emerald-600 hover:bg-emerald-700" },
  ];

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

        {/* Content with Sidebar */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content - Left Side */}
            <article className="lg:col-span-2">
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

            {/* Sidebar - Right Side */}
            <aside className="lg:col-span-1 space-y-6">
              {/* Popular Courses Card */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <BookOpen className="w-5 h-5 text-primary" />
                    জনপ্রিয় কোর্স
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {popularCourses.map((course) => (
                    <Link
                      key={course.id}
                      to={`/courses/${course.slug}`}
                      className="flex gap-3 group"
                    >
                      <img
                        src={course.image_url || ''}
                        alt={course.title}
                        className="w-20 h-14 object-cover rounded-md flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
                          {course.title}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          {course.is_free ? "ফ্রি" : `৳${course.price.toLocaleString()}`}
                        </p>
                      </div>
                    </Link>
                  ))}
                  <Link to="/courses">
                    <Button variant="outline" size="sm" className="w-full mt-2">
                      সব কোর্স দেখুন
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Social Media Card */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">আমাদের সাথে যুক্ত থাকুন</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {socialLinks.map((social) => (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-white transition-colors ${social.color}`}
                    >
                      <social.icon className="w-5 h-5" />
                      <span className="font-medium">{social.name}</span>
                    </a>
                  ))}
                </CardContent>
              </Card>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BlogDetail;
