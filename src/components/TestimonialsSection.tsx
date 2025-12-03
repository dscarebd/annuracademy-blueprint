import { Star, Loader2 } from "lucide-react";
import { useTestimonials } from "@/hooks/useTestimonials";

const TestimonialsSection = () => {
  const { data: testimonials, isLoading } = useTestimonials();

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Heading */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            স্টুডেন্ট <span className="text-gradient">টেস্টিমোনিয়াল</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            মার্কেটপ্লেস কোর্স সম্পর্কে যা ভাবেন
          </p>
        </div>

        {/* Testimonials Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {testimonials?.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-gradient-to-br from-primary/90 to-primary rounded-2xl p-6 text-white flex flex-col justify-between hover:scale-105 transition-transform duration-300"
              >
                {/* Testimonial Text */}
                <p className="text-sm leading-relaxed mb-6">
                  {testimonial.content}
                </p>

                {/* Bottom Section */}
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {testimonial.image_url ? (
                      <img
                        src={testimonial.image_url}
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl font-bold">
                        {testimonial.name.charAt(0)}
                      </span>
                    )}
                  </div>

                  {/* Name, Course, and Rating */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-base mb-1 truncate">
                      {testimonial.name}
                    </h4>
                    {testimonial.course && (
                      <p className="text-xs opacity-90 mb-2 line-clamp-2">
                        <span className="font-semibold">Course:</span>{" "}
                        {testimonial.course}
                      </p>
                    )}
                    {/* Star Rating */}
                    <div className="flex gap-1">
                      {Array.from({ length: testimonial.rating || 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 fill-yellow-300 text-yellow-300"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default TestimonialsSection;
