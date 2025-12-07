import TopBanner from "@/components/TopBanner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail, Send, MessageCircle, Youtube } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useSiteContentMultiple, getContentValue, getContentJson } from "@/hooks/useSiteContent";

interface FAQItem {
  question: string;
  answer: string;
}

const Contact = () => {
  const { data: content } = useSiteContentMultiple([
    "contact_hero_quote",
    "contact_email",
    "contact_telegram",
    "contact_facebook",
    "contact_youtube",
    "contact_faq"
  ]);

  const heroQuote = getContentValue(content, "contact_hero_quote", '"আপনাদের ভালোবাসা আর বিশ্বাস, আমাদের আগামী দিনের পথ চলার রাস্তা তৈরি করবে"');
  const email = getContentValue(content, "contact_email", "nuralam0318@gmail.com");
  const telegram = getContentValue(content, "contact_telegram", "https://t.me/an_nur1");
  const facebook = getContentValue(content, "contact_facebook", "https://facebook.com/annuracademy");
  const youtube = getContentValue(content, "contact_youtube", "https://www.youtube.com/@An-Nur_Academy");
  
  const faqItems = getContentJson<FAQItem[]>(content, "contact_faq", [
    { question: "কোর্স কেনার পর কতদিনের মধ্যে অ্যাক্সেস পাবো?", answer: "পেমেন্ট কনফার্ম হওয়ার পর সাধারণত ১-২ ঘণ্টার মধ্যে আপনি কোর্সে অ্যাক্সেস পেয়ে যাবেন।" },
    { question: "কোর্সের মেয়াদ কতদিন?", answer: "আমাদের সব কোর্সে লাইফটাইম অ্যাক্সেস দেওয়া হয়। একবার কিনলে সারাজীবন দেখতে পারবেন।" },
    { question: "মোবাইল দিয়ে কি কোর্স করা যাবে?", answer: "হ্যাঁ, আমাদের প্ল্যাটফর্ম সম্পূর্ণ মোবাইল ফ্রেন্ডলি। যেকোনো ডিভাইস থেকে কোর্স করতে পারবেন।" },
  ]);

  return (
    <div className="min-h-screen bg-background">
      <TopBanner />
      <Navbar />

      {/* Hero Section */}
      <section className="pt-12 pb-6 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl md:text-3xl font-bold mb-0 text-primary">
            {heroQuote}
          </h1>
        </div>
      </section>

      {/* Contact Guidelines */}
      <section className="pt-6 pb-12 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-card border border-border rounded-lg p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              যোগাযোগ করতে চাইলে...
            </h2>

            <div className="space-y-4 mb-8">
              <div className="flex gap-3">
                <span className="text-destructive text-xl">🔴</span>
                <p className="text-muted-foreground">
                  দয়া করে "আপনার সাথে কাজ করতে চাই, আমার এই ওয়েবসাইট বানিয়ে দেন বা আমার সাইট এর এই সমস্যা হচ্ছে ঠিক করে দেন" - এই জাতীয় প্রশ্ন করে ইমেইল করবেন না, আমার বাইরে কাজ করার মত সময় আপাতত নেই। তাই বাইরে কাজ নিচ্ছি না।
                </p>
              </div>

              <div className="flex gap-3">
                <span className="text-destructive text-xl">🔴</span>
                <p className="text-muted-foreground">
                  আমার কোন অফলাইন কোর্স নেই, তাই অফলাইনে শিখতে চাই বলে ইমেইল করে লাভ নেই
                </p>
              </div>

              <div className="flex gap-3">
                <span className="text-xl">👉</span>
                <p className="text-muted-foreground">
                  কোর্স সম্পর্কে আপনার যদি কিছু জানবার থাকে বা আপনার যদি কোন সাজেশান থাকে অথবা অভিযোগ, আমাদের জানান 😊
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <a
                href={`mailto:${email}`}
                className="flex items-center gap-3 p-4 bg-primary/5 hover:bg-primary/10 rounded-lg transition-colors"
              >
                <Mail className="text-primary" size={24} />
                <span className="text-foreground font-medium">{email}</span>
              </a>

              <a
                href={telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 bg-primary/5 hover:bg-primary/10 rounded-lg transition-colors"
              >
                <Send className="text-primary" size={24} />
                <span className="text-foreground font-medium">Join in Telegram</span>
              </a>

              <a
                href={facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 bg-primary/5 hover:bg-primary/10 rounded-lg transition-colors"
              >
                <MessageCircle className="text-primary" size={24} />
                <span className="text-foreground font-medium">Follow on Facebook</span>
              </a>

              <a
                href={youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 bg-primary/5 hover:bg-primary/10 rounded-lg transition-colors"
              >
                <Youtube className="text-primary" size={24} />
                <span className="text-foreground font-medium">Subscribe on YouTube</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
            সচরাচর জিজ্ঞাসিত প্রশ্ন (FAQ)
          </h2>

          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqItems.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card border border-border rounded-lg px-6"
              >
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  <p>{faq.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
