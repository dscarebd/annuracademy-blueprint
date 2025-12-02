import TopBanner from "@/components/TopBanner";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import CourseCard from "@/components/CourseCard";
import PurpleCallout from "@/components/PurpleCallout";
import Footer from "@/components/Footer";
import courseRemoteJob from "@/assets/course-remote-job.jpg";
import courseWordPress from "@/assets/course-wordpress.jpg";
import courseWebflow from "@/assets/course-webflow.jpg";
import courseCanva from "@/assets/course-canva.jpg";
import courseFigma from "@/assets/course-figma.jpg";

const Index = () => {
  const courses = [
    {
      title: "Remote Job, Work From Home For Developers",
      image: courseRemoteJob,
      level: "Intermediate",
      rating: 4.92,
      reviewCount: 12,
      price: "1,199.00",
      instructor: "Ali Hossain",
      category: "Career Development",
    },
    {
      title: "Canva Masterclass 101",
      image: courseCanva,
      level: "Beginner",
      rating: 5.0,
      reviewCount: 7,
      price: "",
      instructor: "Ali Hossain",
      category: "Design",
      isFree: true,
    },
    {
      title: "Figma Essentials Training For Developers",
      image: courseFigma,
      level: "Beginner",
      rating: 5.0,
      reviewCount: 1,
      price: "599.00",
      instructor: "Ali Hossain",
      category: "Design",
    },
    {
      title: "Webflow Masterclass 101 PREEBOOK",
      image: courseWebflow,
      level: "Beginner",
      rating: 0,
      reviewCount: 0,
      price: "999.00",
      instructor: "Ali Hossain",
      category: "No Code",
    },
    {
      title: "WordPress Customization with WooCommerce",
      image: courseWordPress,
      level: "Beginner",
      rating: 5.0,
      reviewCount: 30,
      price: "1,499.00",
      instructor: "Ali Hossain",
      category: "No Code, WordPress",
    },
  ];

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
      <section id="courses" className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              একটা কোর্স সিলেক্ট করে শেখা শুরু করুন
            </h2>
            <p className="text-lg text-muted-foreground">
              শুধু স্বপ্ন না দেখে স্বপ্নকে বাস্তব করুন
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course, index) => (
              <CourseCard key={index} {...course} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
