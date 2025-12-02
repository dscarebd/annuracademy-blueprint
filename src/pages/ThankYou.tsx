import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const ThankYou = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-grow flex items-center justify-center py-12">
        <div className="container mx-auto px-4 max-w-lg">
          <Card className="p-8 text-center">
            <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              ধন্যবাদ! 🎉
            </h1>
            
            <p className="text-muted-foreground mb-6">
              আপনার অর্ডার সফলভাবে সম্পন্ন হয়েছে। আমরা আপনার পেমেন্ট ভেরিফাই করার পর 
              আপনার ইমেইলে কোর্স অ্যাক্সেস পাঠিয়ে দেব।
            </p>

            <div className="bg-muted/50 rounded-lg p-4 mb-6">
              <p className="text-sm text-muted-foreground">
                সাধারণত ১-২ ঘন্টার মধ্যে অ্যাক্সেস পাবেন। কোনো সমস্যা হলে আমাদের সাথে যোগাযোগ করুন।
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/courses">
                <Button variant="outline">আরও কোর্স দেখুন</Button>
              </Link>
              <Link to="/">
                <Button>হোমে যান</Button>
              </Link>
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ThankYou;
