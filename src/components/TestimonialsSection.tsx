import { Star } from "lucide-react";
import testimonial1 from "@/assets/testimonial-1.jpg";
import testimonial2 from "@/assets/testimonial-2.jpg";
import testimonial3 from "@/assets/testimonial-3.jpg";
import testimonial4 from "@/assets/testimonial-4.jpg";
import testimonial5 from "@/assets/testimonial-5.jpg";
import testimonial6 from "@/assets/testimonial-6.jpg";

const TestimonialsSection = () => {
  // All editable content
  const content = {
    heading: "স্টুডেন্ট",
    headingHighlight: "টেস্টিমোনিয়াল",
    subtitle: "মার্কেটপ্লেস কোর্স সম্পর্কে যা ভাবেন",

    testimonials: [
      {
        id: 1,
        text: "I have just finished the course \"Mastering AI with ChatGPT\" by Ali Hossain, and it outdid my expectations. This course is very well structured, which is great for both beginners and experienced developers. Moreover, this course is not just for coders but also an excellent choice for general online users.",
        name: "রাফি আহমেদ",
        course: "Mastering AI with ChatGPT for Developers",
        avatar: testimonial1,
        rating: 5,
      },
      {
        id: 2,
        text: "সম্পূর্ণ কোর্স মেষ করলাময় অসাধারণ ছিলো।। প্রথমে করানো গেলে এবা হয়ে যাবো আমার প্রতি আজকানা ভালোবাসেরাঐ হয় গেলে আবেক কথা জানে ছাত্রে আমার মাযা জানি না, কোলবেন চম পাবো বিভিন্ন। গেলে খুবগুলো দান হয়ে মায়ো বিস্মপূরেব ভবিতও সভিত্তে আমসানকে গেলেত ফেরিন প্রভবিন গেলেত বের করবেন উপযোগজহরু...... আবোনাময় নিদেন্ন........ ভরী অনুভুবনো ফিস্তরত.......",
        name: "তানভীর হাসান",
        course: "WP Customization with WooCommerce",
        avatar: testimonial2,
        rating: 5,
      },
      {
        id: 3,
        text: "As a newbie in this marketplace, this has been such an awesome experience. I've learned a lot from here, and I'm definitely gonna keep going. Big thanks for sharing such a great roadmap – it really helped me get started! This is just the beginning, and I'm excited to see where it goes.",
        name: "সাদিয়া খান",
        course: "Remote Job: Work From Home For Developers",
        avatar: testimonial3,
        rating: 5,
      },
      {
        id: 4,
        text: "There were several things I needed to know about PROMT that I learned from this course. I hope the course will be updated more in the future and provide more detailed information about different chat models.",
        name: "ফাহিম রহমান",
        course: "WP Customization with WooCommerce",
        avatar: testimonial4,
        rating: 5,
      },
      {
        id: 5,
        text: "From my opinion, this course is very helpful specially for beginners those who don't have any knowledge about Chatbot. I have learnt some unique things from this course that was so amazing. Thanks a lot brother, \"Ali Hossain\"",
        name: "নাফিস ইসলাম",
        course: "Mastering AI with ChatGPT for Developers",
        avatar: testimonial5,
        rating: 5,
      },
      {
        id: 6,
        text: "It was very helpful for me. This course helped me to gain useful information's about the remote jobs and also Ali hossain brother explained how to write a cover letter and resume for the job. Thank U Ali Hossain Brother for sharing your experience in job area with us.",
        name: "শাহরিয়ার কবির",
        course: "Remote Job: Work From Home For Developers",
        avatar: testimonial6,
        rating: 5,
      },
    ],
  };

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Heading */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            {content.heading}{" "}
            <span className="text-gradient">{content.headingHighlight}</span>
          </h2>
          <p className="text-lg text-muted-foreground">{content.subtitle}</p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {content.testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-gradient-to-br from-primary/90 to-primary rounded-2xl p-6 text-white flex flex-col justify-between hover:scale-105 transition-transform duration-300"
            >
              {/* Testimonial Text */}
              <p className="text-sm leading-relaxed mb-6">
                {testimonial.text}
              </p>

              {/* Bottom Section */}
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center overflow-hidden flex-shrink-0">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Name, Course, and Rating */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-base mb-1 truncate">
                    {testimonial.name}
                  </h4>
                  <p className="text-xs opacity-90 mb-2 line-clamp-2">
                    <span className="font-semibold">Course:</span>{" "}
                    {testimonial.course}
                  </p>
                  {/* Star Rating */}
                  <div className="flex gap-1">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
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
      </div>
    </section>
  );
};

export default TestimonialsSection;
