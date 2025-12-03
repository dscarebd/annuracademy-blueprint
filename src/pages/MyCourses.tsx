import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, 
  ArrowLeft, 
  Play, 
  Loader2,
  GraduationCap 
} from "lucide-react";
import { useEnrollments } from "@/hooks/useEnrollments";
import { supabase } from "@/integrations/supabase/client";

const MyCourses = () => {
  const navigate = useNavigate();
  const { data: enrollments, isLoading } = useEnrollments();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
      if (!user) {
        navigate("/admin/auth?redirect=/my-courses");
      }
    };
    checkAuth();
  }, [navigate]);

  if (isAuthenticated === null || isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-grow">
        {/* Back Button */}
        <div className="container mx-auto px-4 py-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            ফিরে যান
          </Button>
        </div>

        <section className="bg-gradient-to-br from-primary/10 via-background to-primary/5 py-8 md:py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground text-center flex items-center justify-center gap-3">
              <GraduationCap className="w-10 h-10 text-primary" />
              আমার কোর্সসমূহ
            </h1>
            <p className="text-muted-foreground text-center mt-2">
              আপনার এনরোল করা সব কোর্স এখানে দেখুন
            </p>
          </div>
        </section>

        <section className="py-8 md:py-12">
          <div className="container mx-auto px-4">
            {!enrollments || enrollments.length === 0 ? (
              <div className="text-center py-16">
                <BookOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  কোনো কোর্স নেই
                </h2>
                <p className="text-muted-foreground mb-6">
                  আপনি এখনো কোনো কোর্সে এনরোল করেননি
                </p>
                <Link to="/courses">
                  <Button>কোর্স দেখুন</Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {enrollments.map((enrollment) => (
                  <Card key={enrollment.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <Link to={`/courses/${enrollment.course?.slug}`}>
                      <img
                        src={enrollment.course?.image_url || '/placeholder.svg'}
                        alt={enrollment.course?.title}
                        className="w-full h-48 object-cover"
                      />
                    </Link>
                    <div className="p-4">
                      <Link to={`/courses/${enrollment.course?.slug}`}>
                        <h3 className="font-semibold text-foreground mb-2 hover:text-primary transition-colors">
                          {enrollment.course?.title}
                        </h3>
                      </Link>
                      <p className="text-sm text-muted-foreground mb-3">
                        {enrollment.course?.instructor} • {enrollment.course?.category}
                      </p>
                      
                      {/* Progress */}
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">অগ্রগতি</span>
                          <span className="font-medium">{enrollment.progress}%</span>
                        </div>
                        <Progress value={enrollment.progress} className="h-2" />
                      </div>

                      <Link to={`/courses/${enrollment.course?.slug}`}>
                        <Button className="w-full" variant={enrollment.progress > 0 ? "outline" : "default"}>
                          <Play className="w-4 h-4 mr-2" />
                          {enrollment.progress > 0 ? "শেখা চালিয়ে যান" : "শেখা শুরু করুন"}
                        </Button>
                      </Link>
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

export default MyCourses;
