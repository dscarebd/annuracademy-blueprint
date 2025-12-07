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
import { usePageSections, PageSection } from "@/hooks/usePageSections";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

// Dynamic section renderer
const renderSection = (section: PageSection, courses: any[] | undefined, isCoursesLoading: boolean) => {
  switch (section.section_key) {
    case "hero":
      return (
        <Hero
          key={section.id}
          title={section.title}
          subtitle={section.subtitle}
          description={section.description}
          buttonText={section.content?.button_text}
          buttonLink={section.content?.button_link}
          imageUrl={section.image_url}
        />
      );

    case "why_us":
      return <WhySection key={section.id} />;

    case "popular_courses":
      return (
        <section key={section.id} id="courses" className="py-16 md:py-24 bg-gray-100">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {section.title || "একটা কোর্স সিলেক্ট করে শেখা শুরু করুন"}
              </h2>
              {section.description && (
                <p className="text-lg text-muted-foreground">
                  {section.description}
                </p>
              )}
            </div>

            {isCoursesLoading ? (
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
                    image={course.image_url || ""}
                    level={course.level || "Beginner"}
                    rating={course.rating || 0}
                    reviewCount={course.review_count || 0}
                    price={course.price}
                    instructor={course.instructor}
                    category={course.category}
                    isFree={course.is_free || false}
                    studentsCount={course.students_count || 0}
                    duration={course.duration || ""}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      );

    case "testimonials":
      return (
        <TestimonialsSection
          key={section.id}
          title={section.title}
          description={section.description}
        />
      );

    case "about_instructor":
      return <AboutMeSection key={section.id} />;

    case "call_to_action":
      return (
        <PurpleCallout key={section.id}>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {section.title || "আজই শুরু করুন আপনার শেখার যাত্রা"}
          </h2>
          {section.description && (
            <p className="text-lg mb-6 opacity-90">{section.description}</p>
          )}
          {section.content?.button_text && (
            <Link to={section.content?.button_link || "/courses"}>
              <Button
                size="lg"
                variant="secondary"
                className="font-semibold text-lg px-8 py-6"
              >
                {section.content.button_text}
              </Button>
            </Link>
          )}
        </PurpleCallout>
      );

    default:
      return null;
  }
};

const Index = () => {
  const { data: courses, isLoading: isCoursesLoading } = useCourses();
  const { data: sections, isLoading: isSectionsLoading } = usePageSections("home");

  // Static callout that appears after hero (not in database)
  const StaticCallout = () => (
    <PurpleCallout>
      <h2 className="text-3xl md:text-4xl font-bold mb-4">
        লাখ টাকা আয়ের স্বপ্নে বিভোর না হয়ে
        <br />
        স্কিল ডেভেলপ করে নিজের স্বপ্ন সত্যি করুন
      </h2>
    </PurpleCallout>
  );

  return (
    <div className="min-h-screen">
      <TopBanner />
      <Navbar />

      {isSectionsLoading ? (
        <div className="flex justify-center items-center py-24">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : sections && sections.length > 0 ? (
        <>
          {sections.map((section) => {
            const sectionContent = renderSection(section, courses, isCoursesLoading);
            return (
              <div key={section.id}>
                {sectionContent}
                {/* Add static callout after hero section, then WhySection */}
                {section.section_key === "hero" && (
                  <>
                    <StaticCallout />
                    <WhySection />
                  </>
                )}
                {/* Add CourseFeaturesSection after why_us */}
                {section.section_key === "popular_courses" && <CourseFeaturesSection />}
              </div>
            );
          })}
        </>
      ) : (
        // Fallback to static content if no sections in database
        <>
          <Hero />
          <PurpleCallout>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              লাখ টাকা আয়ের স্বপ্নে বিভোর না হয়ে
              <br />
              স্কিল ডেভেলপ করে নিজের স্বপ্ন সত্যি করুন
            </h2>
          </PurpleCallout>
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
              {isCoursesLoading ? (
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
                      image={course.image_url || ""}
                      level={course.level || "Beginner"}
                      rating={course.rating || 0}
                      reviewCount={course.review_count || 0}
                      price={course.price}
                      instructor={course.instructor}
                      category={course.category}
                      isFree={course.is_free || false}
                      studentsCount={course.students_count || 0}
                      duration={course.duration || ""}
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
        </>
      )}

      <Footer />
    </div>
  );
};

export default Index;
