import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Clock, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";

import courseWordpress from "@/assets/course-wordpress.jpg";
import courseRemoteJob from "@/assets/course-remote-job.jpg";
import courseCanva from "@/assets/course-canva.jpg";
import courseFigma from "@/assets/course-figma.jpg";
import courseWebflow from "@/assets/course-webflow.jpg";

const Courses = () => {
  const courses = [
    {
      id: 1,
      title: "ওয়ার্ডপ্রেস কাস্টমাইজেশন উইথ উকমার্স",
      image: courseWordpress,
      rating: 5.0,
      reviewCount: 30,
      duration: "25h 20m",
      instructor: "NUR AL-AMIN",
      category: "WordPress",
      price: 1499,
      isFree: false,
    },
    {
      id: 2,
      title: "রিমোট জব, ওয়ার্ক ফ্রম হোম ফর ডেভেলপার্স",
      image: courseRemoteJob,
      rating: 4.92,
      reviewCount: 12,
      duration: "1h 30m",
      instructor: "NUR AL-AMIN",
      category: "Career Development",
      price: 1199,
      isFree: false,
    },
    {
      id: 3,
      title: "ক্যানভা মাস্টারক্লাস ১০১",
      image: courseCanva,
      rating: 5.0,
      reviewCount: 7,
      duration: "1h",
      instructor: "NUR AL-AMIN",
      category: "Design",
      price: 0,
      isFree: true,
    },
    {
      id: 4,
      title: "ফিগমা এসেনশিয়ালস ট্রেনিং ফর ডেভেলপার্স",
      image: courseFigma,
      rating: 5.0,
      reviewCount: 1,
      duration: "3h 15m",
      instructor: "NUR AL-AMIN",
      category: "Design",
      price: 999,
      isFree: false,
    },
    {
      id: 5,
      title: "ওয়েবফ্লো মাস্টারক্লাস ১০১",
      image: courseWebflow,
      rating: 0,
      reviewCount: 0,
      duration: "4h",
      instructor: "NUR AL-AMIN",
      category: "No Code",
      price: 999,
      isFree: false,
    },
  ];

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <Star key={i} className="w-4 h-4 fill-yellow-400/50 text-yellow-400" />
        );
      } else {
        stars.push(
          <Star key={i} className="w-4 h-4 text-gray-300" />
        );
      }
    }
    return stars;
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <Card
                  key={course.id}
                  className="overflow-hidden border border-border hover:shadow-lg transition-all duration-300 group"
                >
                  {/* Course Image */}
                  <div className="relative overflow-hidden">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Course Content */}
                  <div className="p-4">
                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-2">
                      {renderStars(course.rating)}
                      {course.reviewCount > 0 && (
                        <span className="text-sm text-muted-foreground ml-1">
                          {course.rating.toFixed(2)} ({course.reviewCount})
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="font-semibold text-foreground text-lg mb-2 line-clamp-2 min-h-[56px]">
                      {course.title}
                    </h3>

                    {/* Duration */}
                    <div className="flex items-center gap-1 text-muted-foreground text-sm mb-3">
                      <Clock className="w-4 h-4" />
                      <span>{course.duration}</span>
                    </div>

                    {/* Instructor & Category */}
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold text-sm">
                        {course.instructor.charAt(0)}
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">By </span>
                        <span className="text-foreground font-medium">{course.instructor}</span>
                        <span className="text-muted-foreground"> In </span>
                        <span className="text-primary">{course.category}</span>
                      </div>
                    </div>

                    {/* Price & Button */}
                    <div className="flex items-center justify-between pt-3 border-t border-border">
                      <span className="font-bold text-lg text-foreground">
                        {course.isFree ? "ফ্রি" : `${course.price.toLocaleString()}৳`}
                      </span>
                      <Button
                        size="sm"
                        variant={course.isFree ? "default" : "outline"}
                        className="gap-2"
                      >
                        {course.isFree ? (
                          "Enroll"
                        ) : (
                          <>
                            <ShoppingCart className="w-4 h-4" />
                            Add to cart
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Courses;
