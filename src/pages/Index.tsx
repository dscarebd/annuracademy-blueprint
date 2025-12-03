import TopBanner from "@/components/TopBanner";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import WhySection from "@/components/WhySection";
import CourseFeaturesSection from "@/components/CourseFeaturesSection";
import AboutMeSection from "@/components/AboutMeSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import CourseCard from "@/components/CourseCard";
import PurpleCallout from "@/components/PurpleCallout";
import Footer from "@/components/Footer";
import { useCourses } from "@/hooks/useCourses";
import { Loader2 } from "lucide-react";

const Index = () => {
  const { data: courses, isLoading } = useCourses();

  return (
    <div className="min-h-screen">
      <TopBanner />
      <Navbar />
      <Hero />
      
      {/* Purple Callout */}
      <PurpleCallout>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          লাখ টাকা আয়ের স্বপ্নে বিভোর না হয়ে
          <br />
          স্কিল ডেভেলপ করে নিজের স্বপ্ন সত্যি করুন
        </h2>
      </PurpleCallout>

      {/* Courses Section */}
      <section id="courses" className="py-16 md:py-24 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              একটা কোর্স সিলেক্ট করে শেখা শুরু করুন
            </h2>
            <p className="text-lg text-muted-foreground">
              শুধু স্বপ্ন না দেখে স্বপ্নকে বাস্তব করুন
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses?.map((course) => (
                <CourseCard
                  key={course.id}
                  id={course.id}
                  title={course.title}
                  image={course.image_url || ''}
                  level={course.level || 'Beginner'}
                  rating={course.rating || 0}
                  reviewCount={course.review_count || 0}
                  price={course.price}
                  instructor={course.instructor}
                  category={course.category}
                  isFree={course.is_free || false}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <WhySection />

      <CourseFeaturesSection />

      <AboutMeSection />

      <TestimonialsSection />

      <Footer />
    </div>
  );
};

export default Index;
