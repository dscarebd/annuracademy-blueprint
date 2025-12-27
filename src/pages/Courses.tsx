import TopBanner from "@/components/TopBanner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CourseCard from "@/components/CourseCard";
import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useCourses } from "@/hooks/useCourses";

const Courses = () => {
  const { data: courses, isLoading, error } = useCourses();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <TopBanner />
      <Navbar />

      <main className="flex-grow">
        {/* Header */}
        <section className="bg-gradient-to-br from-primary/10 via-background to-primary/5 py-8 md:py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground text-center">
              সকল কোর্স
            </h1>
            <p className="text-muted-foreground text-center mt-2">
              আমাদের সকল কোর্স এক জায়গায়
            </p>
          </div>
        </section>

        {/* Courses Grid */}
        <section className="py-8 md:py-12">
          <div className="container mx-auto px-4">
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : error ? (
              <div className="text-center py-12 text-destructive">
                কোর্স লোড করতে সমস্যা হয়েছে
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses?.map((course) => (
                  <Link key={course.id} to={`/courses/${course.slug}`}>
                    <CourseCard
                      id={course.id}
                      title={course.title}
                      image={course.image_url || ''}
                      level={course.level || 'শিখুন'}
                      rating={course.rating || 0}
                      reviewCount={course.review_count || 0}
                      price={course.price}
                      instructor={course.instructor}
                      category={course.category}
                      isFree={course.is_free || false}
                      studentsCount={course.students_count || 0}
                      duration={course.duration || undefined}
                    />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Courses;
