import TopBanner from "@/components/TopBanner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Clock, ShoppingCart, Check, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";
import { useCourses, Course } from "@/hooks/useCourses";

const Courses = () => {
  const { addToCart, isInCart } = useCart();
  const { toast } = useToast();
  const { data: courses, isLoading, error } = useCourses();

  const handleAddToCart = (course: Course) => {
    if (course.is_free) return;
    
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
                  <Card
                    key={course.id}
                    className="overflow-hidden border border-border hover:shadow-lg transition-all duration-300 group"
                  >
                    {/* Course Image */}
                    <Link to={`/courses/${course.slug}`} className="relative overflow-hidden block">
                      <img
                        src={course.image_url || ''}
                        alt={course.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </Link>

                    {/* Course Content */}
                    <div className="p-4">
                      {/* Rating */}
                      <div className="flex items-center gap-1 mb-2">
                        {renderStars(course.rating || 0)}
                        {(course.review_count || 0) > 0 && (
                          <span className="text-sm text-muted-foreground ml-1">
                            {(course.rating || 0).toFixed(2)} ({course.review_count})
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <Link to={`/courses/${course.slug}`}>
                        <h3 className="font-semibold text-foreground text-lg mb-1 line-clamp-2 min-h-[56px] hover:text-primary transition-colors">
                          {course.title}
                        </h3>
                      </Link>

                      {/* Students & Duration */}
                      <div className="flex items-center gap-3 text-muted-foreground text-sm mb-3">
                        <span>{course.students_count || 0} শিক্ষার্থী</span>
                        {course.duration && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{course.duration}</span>
                          </div>
                        )}
                      </div>

                      {/* Instructor */}
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold text-sm">
                          {course.instructor.charAt(0)}
                        </div>
                        <div className="text-sm">
                          <span className="text-muted-foreground">By </span>
                          <span className="text-foreground font-medium">{course.instructor}</span>
                        </div>
                      </div>

                      {/* Price & Button */}
                      <div className="flex items-center justify-between pt-3 border-t border-border">
                        <span className="font-bold text-lg text-foreground">
                          {course.is_free ? "ফ্রি" : `${course.price.toLocaleString()}৳`}
                        </span>
                        {course.is_free ? (
                          <Button size="sm">
                            Enroll
                          </Button>
                        ) : isInCart(course.id) ? (
                          <Button size="sm" variant="secondary" className="gap-2" disabled>
                            <Check className="w-4 h-4" />
                            Added
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-2"
                            onClick={() => handleAddToCart(course)}
                          >
                            <ShoppingCart className="w-4 h-4" />
                            Add to cart
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
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
