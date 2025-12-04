import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  ArrowLeft, 
  Play, 
  Loader2,
  GraduationCap,
  Clock,
  BookText,
  CheckCircle2,
  Calendar,
  BarChart3,
  LogOut
} from "lucide-react";
import { useEnrollments } from "@/hooks/useEnrollments";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const MyCourses = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: enrollments, isLoading } = useEnrollments();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
      if (!user) {
        navigate("/student-login");
      }
    };
    checkAuth();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "লগআউট সফল",
      description: "আপনি সফলভাবে লগআউট হয়েছেন",
    });
    navigate("/");
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("bn-BD", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Calculate stats
  const totalCourses = enrollments?.length || 0;
  const completedCourses = enrollments?.filter(e => e.progress >= 100).length || 0;
  const inProgressCourses = enrollments?.filter(e => e.progress > 0 && e.progress < 100).length || 0;

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
        {/* Header Section */}
        <section className="bg-gradient-to-br from-primary/10 via-background to-primary/5 py-8 md:py-12">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <Button 
                variant="ghost" 
                onClick={() => navigate("/")}
                className="text-muted-foreground hover:text-primary"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                হোমে যান
              </Button>
              <Button 
                variant="outline" 
                onClick={handleLogout}
                className="text-muted-foreground hover:text-destructive hover:border-destructive"
              >
                <LogOut className="w-4 h-4 mr-2" />
                লগআউট
              </Button>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-foreground text-center flex items-center justify-center gap-3">
              <GraduationCap className="w-10 h-10 text-primary" />
              আমার কোর্সসমূহ
            </h1>
            <p className="text-muted-foreground text-center mt-2">
              আপনার এনরোল করা সব কোর্স এখানে দেখুন
            </p>

            {/* Stats Cards */}
            {totalCourses > 0 && (
              <div className="grid grid-cols-3 gap-4 mt-8 max-w-2xl mx-auto">
                <Card className="p-4 text-center bg-background/80 backdrop-blur">
                  <div className="text-2xl md:text-3xl font-bold text-primary">{totalCourses}</div>
                  <div className="text-xs md:text-sm text-muted-foreground">মোট কোর্স</div>
                </Card>
                <Card className="p-4 text-center bg-background/80 backdrop-blur">
                  <div className="text-2xl md:text-3xl font-bold text-amber-500">{inProgressCourses}</div>
                  <div className="text-xs md:text-sm text-muted-foreground">চলমান</div>
                </Card>
                <Card className="p-4 text-center bg-background/80 backdrop-blur">
                  <div className="text-2xl md:text-3xl font-bold text-green-500">{completedCourses}</div>
                  <div className="text-xs md:text-sm text-muted-foreground">সম্পন্ন</div>
                </Card>
              </div>
            )}
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
                  <Button className="gradient-purple text-white">কোর্স দেখুন</Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {enrollments.map((enrollment) => (
                  <Card key={enrollment.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
                    <div className="relative">
                      <Link to={`/courses/${enrollment.course?.slug}`}>
                        <img
                          src={enrollment.course?.image_url || '/placeholder.svg'}
                          alt={enrollment.course?.title}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </Link>
                      {/* Status Badge */}
                      <div className="absolute top-3 right-3">
                        {enrollment.progress >= 100 ? (
                          <Badge className="bg-green-500 hover:bg-green-600">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            সম্পন্ন
                          </Badge>
                        ) : enrollment.progress > 0 ? (
                          <Badge className="bg-amber-500 hover:bg-amber-600">
                            <BarChart3 className="w-3 h-3 mr-1" />
                            চলমান
                          </Badge>
                        ) : (
                          <Badge variant="secondary">
                            নতুন
                          </Badge>
                        )}
                      </div>
                      {/* Category Badge */}
                      <div className="absolute top-3 left-3">
                        <Badge variant="secondary" className="bg-background/90 backdrop-blur">
                          {enrollment.course?.category}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <Link to={`/courses/${enrollment.course?.slug}`}>
                        <h3 className="font-semibold text-foreground mb-2 hover:text-primary transition-colors line-clamp-2">
                          {enrollment.course?.title}
                        </h3>
                      </Link>
                      
                      <p className="text-sm text-muted-foreground mb-3">
                        {enrollment.course?.instructor}
                      </p>

                      {/* Course Meta */}
                      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-4">
                        {enrollment.course?.duration && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {enrollment.course.duration}
                          </span>
                        )}
                        {enrollment.course?.lessons_count && (
                          <span className="flex items-center gap-1">
                            <BookText className="w-3 h-3" />
                            {enrollment.course.lessons_count} লেসন
                          </span>
                        )}
                        {enrollment.course?.level && (
                          <span className="flex items-center gap-1">
                            <BarChart3 className="w-3 h-3" />
                            {enrollment.course.level}
                          </span>
                        )}
                      </div>

                      {/* Last Watched / Continue Info */}
                      {enrollment.last_watched_at && enrollment.progress > 0 && enrollment.progress < 100 && (
                        <div className="flex items-center gap-1 text-xs text-primary mb-2">
                          <Play className="w-3 h-3" />
                          <span>
                            মডিউল {(enrollment.last_module_index ?? 0) + 1}, লেসন {(enrollment.last_lesson_index ?? 0) + 1} থেকে শুরু করুন
                          </span>
                        </div>
                      )}

                      {/* Enrolled Date */}
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-4">
                        <Calendar className="w-3 h-3" />
                        এনরোল: {formatDate(enrollment.enrolled_at)}
                      </div>
                      
                      {/* Progress */}
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">অগ্রগতি</span>
                          <span className="font-medium text-primary">{enrollment.progress}%</span>
                        </div>
                        <Progress 
                          value={enrollment.progress} 
                          className="h-2"
                        />
                      </div>

                      <Link to={`/learn/${enrollment.course?.slug}`}>
                        <Button 
                          className={`w-full ${enrollment.progress >= 100 ? '' : 'gradient-purple text-white'}`}
                          variant={enrollment.progress >= 100 ? "outline" : "default"}
                        >
                          <Play className="w-4 h-4 mr-2" />
                          {enrollment.progress >= 100 
                            ? "আবার দেখুন" 
                            : enrollment.progress > 0 
                              ? "শেখা চালিয়ে যান" 
                              : "শেখা শুরু করুন"
                          }
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
