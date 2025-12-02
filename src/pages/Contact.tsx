import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Send, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
const Contact = () => {
  const {
    toast
  } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "বার্তা পাঠানো হয়েছে!",
      description: "আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।"
    });
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: ""
    });
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  return <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="py-12 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-primary font-medium mb-4">আমাদের সাথে</p>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            "একটি দৃঢ় সম্পর্ক যেকোনো কিছু উপর টিকে থাকতে পারে"
          </h1>
        </div>
      </section>

      {/* Contact Guidelines */}
      <section className="py-12 bg-background">
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
              <a href="mailto:support@annuracademy.com" className="flex items-center gap-3 p-4 bg-primary/5 hover:bg-primary/10 rounded-lg transition-colors">
                <Mail className="text-primary" size={24} />
                <span className="text-foreground font-medium">support@annuracademy.com</span>
              </a>
              
              <a href="https://t.me/annuracademy" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-primary/5 hover:bg-primary/10 rounded-lg transition-colors">
                <Send className="text-primary" size={24} />
                <span className="text-foreground font-medium">Join in Telegram</span>
              </a>
              
              <a href="https://www.facebook.com/annuracademy" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-primary/5 hover:bg-primary/10 rounded-lg transition-colors">
                <MessageCircle className="text-primary" size={24} />
                <span className="text-foreground font-medium">Follow on Facebook</span>
              </a>
              
              <a href="https://www.youtube.com/@annuracademy" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-primary/5 hover:bg-primary/10 rounded-lg transition-colors">
                <MessageCircle className="text-primary" size={24} />
                <span className="text-foreground font-medium">Subscribe on YouTube</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="bg-card border border-border rounded-lg p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              আমাদের বার্তা পাঠান
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name">আপনার নাম *</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleChange} required placeholder="আপনার পুরো নাম লিখুন" className="mt-2" />
              </div>

              <div>
                <Label htmlFor="email">ইমেইল ঠিকানা *</Label>
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required placeholder="your@email.com" className="mt-2" />
              </div>

              <div>
                <Label htmlFor="subject">বিষয় *</Label>
                <Input id="subject" name="subject" value={formData.subject} onChange={handleChange} required placeholder="আপনার বার্তার বিষয়" className="mt-2" />
              </div>

              <div>
                <Label htmlFor="message">বার্তা *</Label>
                <Textarea id="message" name="message" value={formData.message} onChange={handleChange} required placeholder="আপনার বিস্তারিত বার্তা লিখুন..." className="mt-2 min-h-[150px]" />
              </div>

              <Button type="submit" className="w-full" size="lg">
                বার্তা পাঠান
              </Button>
            </form>
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
            <AccordionItem value="item-1" className="bg-card border border-border rounded-lg px-6">
              <AccordionTrigger className="text-left">
                বিকাশ ভেরিফিকেশন সমস্যার সমাধান
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                <div className="space-y-4">
                  <p>
                    আপনার বিকাশ লেনদেনটি যদি কোনো কারণে ভেরিফাই না হয়, তাহলে দয়া করে নিচের তথ্যসহ আমাদের সাপোর্ট ইমেইল করুন:
                  </p>
                  <ul className="list-disc list-inside space-y-2">
                    <li><strong>আপনার বিকাশ নাম্বার:</strong></li>
                    <li><strong>ট্রানজেকশন আইডি:</strong></li>
                  </ul>
                  <p>
                    আপনার এই তথ্যগুলো পাঠানোর পর আমরা আপনার সমস্যার দ্রুত সমাধানে কাজ শুরু করব। ইনশাআল্লাহ, আমরা আপনার enroll করা কোর্সেট ২৪ ঘন্টার মধ্যে সক্রিয় করে দেব।
                  </p>
                  <p className="font-semibold">ইমেইল: support@annuracademy.com</p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="bg-card border border-border rounded-lg px-6">
              <AccordionTrigger className="text-left">
                কোর্সে এনরোল করার পর কতদিনের মধ্যে এক্সেস পাব?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                <p>
                  পেমেন্ট সফল হওয়ার সাথে সাথেই আপনি কোর্সে এক্সেস পাবেন। যদি কোনো কারণে পেমেন্ট ভেরিফাই না হয়, তাহলে ২৪ ঘন্টার মধ্যে ম্যানুয়ালি আপনার এক্সেস দেওয়া হবে। সমস্যা হলে support@annuracademy.com এ ইমেইল করুন।
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="bg-card border border-border rounded-lg px-6">
              <AccordionTrigger className="text-left">
                কোর্সের ভিডিওগুলো কি ডাউনলোড করা যাবে?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                <p>
                  না, কোর্সের ভিডিওগুলো শুধুমাত্র অনলাইনে দেখতে পারবেন। এটি কন্টেন্ট সিকিউরিটি এবং কপিরাইট সুরক্ষার জন্য করা হয়েছে। তবে আপনি লাইফটাইম এক্সেস পাবেন এবং যেকোনো সময় দেখতে পারবেন।
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="bg-card border border-border rounded-lg px-6">
              <AccordionTrigger className="text-left">
                কোর্স কমপ্লিট করতে কতদিন সময় লাগবে?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                <p>
                  এটি সম্পূর্ণভাবে আপনার উপর নির্ভর করে। আপনি দিনে কতটুকু সময় দিতে পারবেন তার উপর ভিত্তি করে এটি ১-৩ মাসের মধ্যে শেষ করতে পারবেন। তবে আপনার কাছে লাইফটাইম এক্সেস থাকবে, তাই আপনার সুবিধামত সময়ে শিখতে পারবেন।
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-7" className="bg-card border border-border rounded-lg px-6">
              <AccordionTrigger className="text-left">
                কোর্সের সাপোর্ট কিভাবে পাব?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                <p>
                  প্রতিটি কোর্সের একটি ডেডিকেটেড টেলিগ্রাম গ্রুপ রয়েছে যেখানে আপনি প্রশ্ন করতে পারবেন। এছাড়াও কোর্সের প্রতিটি ভিডিওর নিচে কমেন্ট সেকশনে প্রশ্ন করতে পারবেন। জরুরি বিষয়ের জন্য support@annuracademy.com এ ইমেইল করুন।
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      <Footer />
    </div>;
};
export default Contact;