import { useParams, Link, useNavigate } from "react-router-dom";
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
  Check, 
  Loader2,
  ArrowLeft,
  Play,
  Lock,
  ChevronRight
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useCart } from "@/context/CartContext";
import { useCourseBySlug, CourseModule } from "@/hooks/useCourses";

const CourseDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const { data: course, isLoading, error } = useCourseBySlug(slug || "");

  const handleJoinNow = () => {
    if (!course || course.is_free) return;
    
    addToCart({
      id: course.id,
      title: course.title,
      image: course.image_url || '',
      price: course.price,
      instructor: course.instructor,
      category: course.category,
    });
    
    navigate('/checkout');
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

  // Default data for fallback
  const defaultLearningOutcomes = [
    "বেসিক থেকে অ্যাডভান্সড লেভেল পর্যন্ত সম্পূর্ণ ধারণা",
    "রিয়েল-ওয়ার্ল্ড প্রজেক্ট তৈরির অভিজ্ঞতা",
    "ইন্ডাস্ট্রি স্ট্যান্ডার্ড বেস্ট প্র্যাক্টিস",
    "প্রফেশনাল পোর্টফোলিও তৈরি",
    "জব রেডি স্কিল ডেভেলপমেন্ট",
    "লাইফটাইম সাপোর্ট ও আপডেট",
  ];

  const defaultRequirements = [
    "কম্পিউটার বা ল্যাপটপ (উইন্ডোজ/ম্যাক)",
    "ইন্টারনেট কানেকশন",
    "বেসিক কম্পিউটার স্কিল",
    "শেখার আগ্রহ ও ধৈর্য",
  ];

  const defaultModules: CourseModule[] = [
    { 
      title: "পরিচিতি", 
      lessons: [
        { name: "কোর্স ওভারভিউ", duration: "04:02", preview: true },
        { name: "সফটওয়্যার ইনস্টলেশন", duration: "08:14", preview: true },
        { name: "ইন্টারফেস পরিচিতি", duration: "12:53", preview: false },
      ]
    },
    { 
      title: "বেসিক কনসেপ্ট", 
      lessons: [
        { name: "ফান্ডামেন্টাল ধারণা", duration: "15:20", preview: false },
        { name: "টুলস ও টেকনিক", duration: "18:45", preview: false },
        { name: "প্র্যাক্টিক্যাল এক্সারসাইজ", duration: "22:10", preview: false },
      ]
    },
    { 
      title: "ইন্টারমিডিয়েট লেভেল", 
      lessons: [
        { name: "অ্যাডভান্সড ফিচার্স", duration: "20:30", preview: false },
        { name: "প্রজেক্ট সেটআপ", duration: "16:15", preview: false },
        { name: "ওয়ার্কফ্লো অপ্টিমাইজেশন", duration: "14:45", preview: false },
        { name: "টিপস ও ট্রিকস", duration: "12:20", preview: false },
      ]
    },
    { 
      title: "অ্যাডভান্সড টেকনিক", 
      lessons: [
        { name: "প্রফেশনাল টেকনিক", duration: "25:00", preview: false },
        { name: "ইন্ডাস্ট্রি স্ট্যান্ডার্ড", duration: "18:30", preview: false },
        { name: "কেস স্টাডি বিশ্লেষণ", duration: "22:15", preview: false },
      ]
    },
    { 
      title: "প্রজেক্ট ওয়ার্ক", 
      lessons: [
        { name: "রিয়েল প্রজেক্ট ১", duration: "35:00", preview: false },
        { name: "রিয়েল প্রজেক্ট ২", duration: "40:20", preview: false },
        { name: "পোর্টফোলিও তৈরি", duration: "28:45", preview: false },
      ]
    },
    { 
      title: "ক্যারিয়ার গাইডলাইন", 
      lessons: [
        { name: "জব মার্কেট অ্যানালাইসিস", duration: "15:00", preview: false },
        { name: "ইন্টারভিউ প্রিপারেশন", duration: "20:30", preview: false },
        { name: "ফ্রিল্যান্সিং গাইড", duration: "25:15", preview: false },
        { name: "সাকসেস টিপস", duration: "10:00", preview: false },
      ]
    },
  ];

  const learningOutcomes = course?.learning_outcomes?.length 
    ? (course.learning_outcomes as string[]) 
    : defaultLearningOutcomes;

  const requirements = course?.requirements?.length 
    ? (course.requirements as string[]) 
    : defaultRequirements;

  const modules = course?.modules?.length 
    ? (course.modules as CourseModule[]) 
    : defaultModules;

  // Calculate total lessons from modules
  const totalLessons = modules.reduce((total, module) => total + module.lessons.length, 0);

  // Calculate total duration from all lessons (format: MM:SS)
  const calculateTotalDuration = () => {
    let totalSeconds = 0;
    modules.forEach(module => {
      module.lessons.forEach(lesson => {
        if (lesson.duration) {
          const parts = lesson.duration.split(':');
          if (parts.length === 2) {
            totalSeconds += parseInt(parts[0]) * 60 + parseInt(parts[1]);
          }
        }
      });
    });
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const totalDuration = calculateTotalDuration();

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
            {/* Course Header - Always on top */}
            <div className="mb-6">
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

              {/* Stats */}
              <div className="flex flex-wrap gap-4 mb-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="w-5 h-5" />
                  <span>{course.students_count || 0} শিক্ষার্থী</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <BookOpen className="w-5 h-5" />
                  <span>{totalLessons} লেসন</span>
                </div>
                {totalDuration && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-5 h-5" />
                    <span>{totalDuration}</span>
                  </div>
                )}
                {course.level && (
                  <Badge variant="outline">{course.level}</Badge>
                )}
              </div>
            </div>

            {/* Mobile Layout - Stack vertically */}
            <div className="flex flex-col lg:hidden gap-6">
              {/* 1. Price Card */}
              <Card id="price-card-mobile" className="overflow-hidden">
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
                  ) : (
                    <Button className="w-full" size="lg" onClick={handleJoinNow}>
                      এখনোই জয়েন করুন
                    </Button>
                  )}
                </div>
              </Card>

              {/* 2. Course Modules */}
              <Card className="p-0 overflow-hidden">
                <div className="p-4 border-b">
                  <h3 className="text-lg font-semibold">কোর্স মডিউল ({modules.length}টি)</h3>
                </div>
                <Accordion type="single" collapsible className="w-full">
                  {modules.map((module, index) => (
                    <AccordionItem key={index} value={`mobile-module-${index}`} className="border-b last:border-b-0">
                      <AccordionTrigger className="hover:no-underline px-4 py-4 hover:bg-muted/30 [&[data-state=open]]:text-primary [&[data-state=open]]:bg-primary/5 [&>svg]:hidden">
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-3">
                            <span className="w-7 h-7 rounded-full bg-primary/10 text-primary text-sm font-semibold flex items-center justify-center">
                              {index + 1}
                            </span>
                            <span className="font-medium text-left">{module.title}</span>
                            <span className="text-xs text-muted-foreground">({module.lessons.length}টি লেসন)</span>
                          </div>
                          <ChevronRight className="w-5 h-5 transition-transform duration-200 [[data-state=open]>&]:rotate-90" />
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pb-0">
                        <ul className="border-l-2 border-primary/30 ml-4">
                          {module.lessons.map((lesson, lessonIndex) => (
                            <li key={lessonIndex} className="flex items-center justify-between py-3 px-4 hover:bg-muted/20 transition-colors">
                              <div className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center">
                                  <Play className="w-3 h-3 text-primary" />
                                </div>
                                <span className="text-sm">{lesson.name}</span>
                              </div>
                              <div className="flex items-center gap-3 text-muted-foreground">
                                <span className="text-xs">{lesson.duration}</span>
                                <Lock className="w-4 h-4" />
                              </div>
                            </li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </Card>

              {/* 3. What You'll Learn */}
              <Card>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Check className="w-5 h-5 text-primary" />
                    যা শিখবেন
                  </h3>
                  <ul className="space-y-3">
                    {learningOutcomes.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>

              {/* 4. Requirements */}
              <Card>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-primary" />
                    প্রয়োজনীয়তা
                  </h3>
                  <ul className="space-y-3">
                    {requirements.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>

              {/* 5. Course Description */}
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

              {/* 6. Instructor */}
              <Card>
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-4">ইন্সট্রাক্টর</h3>
                  <div className="flex flex-col items-center text-center">
                    {course.instructor_image_url ? (
                      <img 
                        src={course.instructor_image_url} 
                        alt={course.instructor}
                        className="w-20 h-20 rounded-full object-cover mb-4"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center text-primary text-2xl font-bold mb-4">
                        {course.instructor.charAt(0)}
                      </div>
                    )}
                    <h4 className="font-semibold text-lg">{course.instructor}</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      {course.instructor_subtitle || `${course.category} এক্সপার্ট`}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span>{course.rating || 4.9} রেটিং</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{course.students_count || 5000}+ শিক্ষার্থী</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {course.instructor_description || "দীর্ঘ অভিজ্ঞতা সম্পন্ন পেশাদার ইন্সট্রাক্টর। শত শত শিক্ষার্থীকে সফলভাবে ট্রেনিং দিয়েছেন এবং তাদের ক্যারিয়ার গড়তে সাহায্য করেছেন।"}
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Desktop Layout - Two columns */}
            <div className="hidden lg:grid lg:grid-cols-[1fr_400px] gap-8">
              {/* Left Side - Course Details */}
              <div className="space-y-6 min-w-0">
                {/* What You'll Learn */}
                <Card>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <Check className="w-5 h-5 text-primary" />
                      যা শিখবেন
                    </h3>
                    <ul className="grid md:grid-cols-2 gap-3">
                      {learningOutcomes.map((item, index) => (
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
                      {requirements.map((item, index) => (
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
              <div>
                <div className="sticky top-4 space-y-6">
                  {/* Price Card */}
                  <Card id="price-card" className="overflow-hidden">
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
                      ) : (
                        <Button className="w-full" size="lg" onClick={handleJoinNow}>
                          এখনোই জয়েন করুন
                        </Button>
                      )}
                    </div>
                  </Card>

                  {/* Course Modules */}
                  <Card className="p-0 overflow-hidden">
                    <div className="p-4 border-b">
                      <h3 className="text-lg font-semibold">কোর্স মডিউল ({modules.length}টি)</h3>
                    </div>
                    <Accordion type="single" collapsible className="w-full">
                      {modules.map((module, index) => (
                        <AccordionItem key={index} value={`module-${index}`} className="border-b last:border-b-0">
                          <AccordionTrigger className="hover:no-underline px-4 py-4 hover:bg-muted/30 [&[data-state=open]]:text-primary [&[data-state=open]]:bg-primary/5 [&>svg]:hidden">
                            <div className="flex items-center justify-between w-full">
                              <div className="flex items-center gap-3">
                                <span className="w-7 h-7 rounded-full bg-primary/10 text-primary text-sm font-semibold flex items-center justify-center">
                                  {index + 1}
                                </span>
                                <span className="font-medium">{module.title}</span>
                                <span className="text-xs text-muted-foreground">({module.lessons.length}টি লেসন)</span>
                              </div>
                              <ChevronRight className="w-5 h-5 transition-transform duration-200 [[data-state=open]>&]:rotate-90" />
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="pb-0">
                            <ul className="border-l-2 border-primary/30 ml-4">
                              {module.lessons.map((lesson, lessonIndex) => (
                                <li 
                                  key={lessonIndex} 
                                  className="flex items-center justify-between py-3 px-4 hover:bg-muted/20 transition-colors cursor-pointer"
                                  onClick={() => {
                                    const priceCard = document.getElementById('price-card');
                                    if (priceCard) {
                                      priceCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                      priceCard.classList.add('ring-2', 'ring-primary', 'ring-offset-2');
                                      setTimeout(() => {
                                        priceCard.classList.remove('ring-2', 'ring-primary', 'ring-offset-2');
                                      }, 2000);
                                    }
                                  }}
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center">
                                      <Play className="w-3 h-3 text-primary" />
                                    </div>
                                    <span className="text-sm">{lesson.name}</span>
                                  </div>
                                  <div className="flex items-center gap-3 text-muted-foreground">
                                    <span className="text-xs">{lesson.duration}</span>
                                    <Lock className="w-4 h-4" />
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </Card>

                  {/* Instructor Card */}
                  <Card>
                    <div className="p-6">
                      <h3 className="text-lg font-semibold mb-4">ইন্সট্রাক্টর</h3>
                      <div className="flex flex-col items-center text-center">
                        {course.instructor_image_url ? (
                          <img 
                            src={course.instructor_image_url} 
                            alt={course.instructor}
                            className="w-20 h-20 rounded-full object-cover mb-4"
                          />
                        ) : (
                          <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center text-primary text-2xl font-bold mb-4">
                            {course.instructor.charAt(0)}
                          </div>
                        )}
                        <h4 className="font-semibold text-lg">{course.instructor}</h4>
                        <p className="text-sm text-muted-foreground mb-4">
                          {course.instructor_subtitle || `${course.category} এক্সপার্ট`}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span>{course.rating || 4.9} রেটিং</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>{course.students_count || 5000}+ শিক্ষার্থী</span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {course.instructor_description || "দীর্ঘ অভিজ্ঞতা সম্পন্ন পেশাদার ইন্সট্রাক্টর। শত শত শিক্ষার্থীকে সফলভাবে ট্রেনিং দিয়েছেন এবং তাদের ক্যারিয়ার গড়তে সাহায্য করেছেন।"}
                        </p>
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