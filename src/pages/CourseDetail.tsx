import { useParams, Link } from "react-router-dom";
import TopBanner from "@/components/TopBanner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Star, 
  Clock, 
  Users, 
  BookOpen, 
  ShoppingCart, 
  Check, 
  Loader2,
  ArrowLeft
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";
import { useCourseBySlug } from "@/hooks/useCourses";

const CourseDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { addToCart, isInCart } = useCart();
  const { toast } = useToast();
  const { data: course, isLoading, error } = useCourseBySlug(slug || "");

  const handleAddToCart = () => {
    if (!course || course.is_free) return;
    
    addToCart({
      id: course.id,
      title: course.title,
      image: course.image_url || '',
      price: course.price,
      instructor: course.instructor,
      category: course.category,
    });
    
    toast({
      title: "কার্টে যোগ করা হয়েছে",
      description: course.title,
    });
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <Star key={i} className="w-5 h-5 fill-yellow-400/50 text-yellow-400" />
        );
      } else {
        stars.push(
          <Star key={i} className="w-5 h-5 text-gray-300" />
        );
      }
    }
    return stars;
  };

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

  if (error || !course) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <TopBanner />
        <Navbar />
        <main className="flex-grow flex flex-col items-center justify-center gap-4">
          <p className="text-destructive text-lg">কোর্স পাওয়া যায়নি</p>
          <Link to="/courses">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              সব কোর্স দেখুন
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
          <Link to="/courses" className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            সব কোর্স
          </Link>
        </div>

        {/* Main Content */}
        <section className="py-8 md:py-12">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left Side - Course Details */}
              <div className="lg:col-span-2 space-y-6">
                {/* Course Header */}
                <div>
                  <Badge className="mb-4">{course.category}</Badge>
                  <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                    {course.title}
                  </h1>
                  <p className="text-muted-foreground mb-6">
                    {course.description}
                  </p>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex">{renderStars(course.rating || 0)}</div>
                    <span className="text-sm text-muted-foreground">
                      {(course.rating || 0).toFixed(1)} ({course.review_count || 0} রিভিউ)
                    </span>
                  </div>

                  {/* Instructor */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
                      {course.instructor.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">ইন্সট্রাক্টর</p>
                      <p className="font-medium">{course.instructor}</p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex flex-wrap gap-4 mb-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="w-5 h-5" />
                      <span>{course.students_count || 0} শিক্ষার্থী</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <BookOpen className="w-5 h-5" />
                      <span>{course.lessons_count || 0} লেসন</span>
                    </div>
                    {course.duration && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="w-5 h-5" />
                        <span>{course.duration}</span>
                      </div>
                    )}
                    {course.level && (
                      <Badge variant="outline">{course.level}</Badge>
                    )}
                  </div>
                </div>

                {/* What You'll Learn */}
                <Card>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <Check className="w-5 h-5 text-primary" />
                      যা শিখবেন
                    </h3>
                    <ul className="grid md:grid-cols-2 gap-3">
                      {[
                        "বেসিক থেকে অ্যাডভান্সড লেভেল পর্যন্ত সম্পূর্ণ ধারণা",
                        "রিয়েল-ওয়ার্ল্ড প্রজেক্ট তৈরির অভিজ্ঞতা",
                        "ইন্ডাস্ট্রি স্ট্যান্ডার্ড বেস্ট প্র্যাক্টিস",
                        "প্রফেশনাল পোর্টফোলিও তৈরি",
                        "জব রেডি স্কিল ডেভেলপমেন্ট",
                        "লাইফটাইম সাপোর্ট ও আপডেট",
                      ].map((item, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card>

                {/* Requirements */}
                <Card>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-primary" />
                      প্রয়োজনীয়তা
                    </h3>
                    <ul className="space-y-3">
                      {[
                        "কম্পিউটার বা ল্যাপটপ (উইন্ডোজ/ম্যাক)",
                        "ইন্টারনেট কানেকশন",
                        "বেসিক কম্পিউটার স্কিল",
                        "শেখার আগ্রহ ও ধৈর্য",
                      ].map((item, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                          <span className="text-muted-foreground">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card>

                {/* Course Description */}
                <Card>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-4">কোর্স বিবরণ</h3>
                    <div className="prose prose-sm max-w-none text-muted-foreground">
                      <p>
                        এই কোর্সটি বিশেষভাবে ডিজাইন করা হয়েছে যারা {course.category} সেক্টরে ক্যারিয়ার গড়তে চান তাদের জন্য। 
                        {course.instructor} এর তত্ত্বাবধানে আপনি শিখবেন সবচেয়ে আপডেটেড এবং ইন্ডাস্ট্রি-রিলেভেন্ট স্কিলস।
                      </p>
                      <p className="mt-4">
                        কোর্সটিতে রয়েছে {course.lessons_count || 0}+ লেসন, প্র্যাক্টিক্যাল প্রজেক্ট, এবং লাইফটাইম অ্যাক্সেস। 
                        আমাদের সাপোর্ট টিম সবসময় আপনার পাশে থাকবে।
                      </p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Right Side - Price Card & Modules */}
              <div className="lg:col-span-1">
                <div className="sticky top-4 space-y-6">
                  {/* Price Card */}
                  <Card className="overflow-hidden">
                    <img
                      src={course.image_url || ''}
                      alt={course.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-6">
                      <div className="flex items-baseline gap-3 mb-6">
                        <span className="text-3xl font-bold text-foreground">
                          {course.is_free ? "ফ্রি" : `৳${course.price.toLocaleString()}`}
                        </span>
                        {course.original_price && (
                          <span className="text-lg text-muted-foreground line-through">
                            ৳{course.original_price.toLocaleString()}
                          </span>
                        )}
                      </div>
                      
                      {course.is_free ? (
                        <Button className="w-full" size="lg">
                          ফ্রি এনরোল করুন
                        </Button>
                      ) : isInCart(course.id) ? (
                        <Button className="w-full" size="lg" variant="secondary" disabled>
                          <Check className="w-5 h-5 mr-2" />
                          কার্টে আছে
                        </Button>
                      ) : (
                        <Button className="w-full" size="lg" onClick={handleAddToCart}>
                          <ShoppingCart className="w-5 h-5 mr-2" />
                          কার্টে যোগ করুন
                        </Button>
                      )}
                    </div>
                  </Card>

                  {/* Course Modules */}
                  <Card>
                    <div className="p-6">
                      <h3 className="text-lg font-semibold mb-4">কোর্স মডিউল</h3>
                      <div className="space-y-3">
                        {[
                          { title: "মডিউল ১: পরিচিতি", lessons: 5 },
                          { title: "মডিউল ২: বেসিক কনসেপ্ট", lessons: 8 },
                          { title: "মডিউল ৩: প্র্যাক্টিক্যাল প্রজেক্ট", lessons: 10 },
                          { title: "মডিউল ৪: অ্যাডভান্সড টপিক", lessons: 7 },
                          { title: "মডিউল ৫: ফাইনাল প্রজেক্ট", lessons: 5 },
                        ].map((module, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                          >
                            <span className="font-medium text-sm">{module.title}</span>
                            <Badge variant="secondary">{module.lessons} লেসন</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>
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

export default CourseDetail;
