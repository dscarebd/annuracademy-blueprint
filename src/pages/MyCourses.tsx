import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import DashboardHeader from "@/components/DashboardHeader";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Play, 
  Loader2,
  GraduationCap,
  Clock,
  BookText,
  CheckCircle2,
  BarChart3,
  ShoppingBag,
  Package,
  XCircle,
  Star,
  ArrowRight
} from "lucide-react";
import { useEnrollments } from "@/hooks/useEnrollments";
import { useUserOrders } from "@/hooks/useUserOrders";
import { useCourses } from "@/hooks/useCourses";
import { supabase } from "@/integrations/supabase/client";

const MyCourses = () => {
  const navigate = useNavigate();
  const { data: enrollments, isLoading } = useEnrollments();
  const { data: orders, isLoading: ordersLoading } = useUserOrders();
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

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("bn-BD", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "কনফার্মড":
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100 text-xs">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            কনফার্মড
          </Badge>
        );
      case "বাতিল":
        return (
          <Badge className="bg-red-100 text-red-700 hover:bg-red-100 text-xs">
            <XCircle className="w-3 h-3 mr-1" />
            বাতিল
          </Badge>
        );
      default:
        return (
          <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 text-xs">
            <Clock className="w-3 h-3 mr-1" />
            পেন্ডিং
          </Badge>
        );
    }
  };

  // Calculate stats
  const totalCourses = enrollments?.length || 0;
  const completedCourses = enrollments?.filter(e => e.progress >= 100).length || 0;
  const inProgressCourses = enrollments?.filter(e => e.progress > 0 && e.progress < 100).length || 0;

  // Get popular courses (top 3 by students count)
  const { data: allCourses, isError: coursesError, refetch: refetchCourses, isFetching: coursesFetching } = useCourses();
  const popularCourses = allCourses
    ?.sort((a, b) => (b.students_count || 0) - (a.students_count || 0))
    .slice(0, 3);

  if (isAuthenticated === null || isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-muted/30">
        <DashboardHeader />
        <main className="flex-grow flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <DashboardHeader />

      <main className="flex-grow">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Main Content - First on mobile/tablet */}
            <div className="flex-1 order-1 lg:order-2">
              {/* Header */}
              <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
                  <GraduationCap className="w-8 h-8 text-primary" />
                  আমার কোর্সসমূহ
                </h1>
                <p className="text-muted-foreground text-sm mt-1">
                  আপনার এনরোল করা সব কোর্স এখানে দেখুন
                </p>
              </div>

              {/* Course Grid */}
              {!enrollments || enrollments.length === 0 ? (
                <Card className="p-8 text-center">
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
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {enrollments.map((enrollment) => (
                    <Card key={enrollment.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
                      <div className="relative">
                        <Link to={`/courses/${enrollment.course?.slug}`}>
                          <img
                            src={enrollment.course?.image_url || '/placeholder.svg'}
                            alt={enrollment.course?.title}
                            className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </Link>
                        {/* Status Badge */}
                        <div className="absolute top-2 right-2">
                          {enrollment.progress >= 100 ? (
                            <Badge className="bg-green-500 hover:bg-green-600 text-xs">
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              সম্পন্ন
                            </Badge>
                          ) : enrollment.progress > 0 ? (
                            <Badge className="bg-amber-500 hover:bg-amber-600 text-xs">
                              <BarChart3 className="w-3 h-3 mr-1" />
                              চলমান
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="text-xs">
                              নতুন
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <Link to={`/courses/${enrollment.course?.slug}`}>
                          <h3 className="font-semibold text-foreground mb-1 hover:text-primary transition-colors line-clamp-2 text-sm">
                            {enrollment.course?.title}
                          </h3>
                        </Link>
                        
                        <p className="text-xs text-muted-foreground mb-2">
                          {enrollment.course?.instructor}
                        </p>

                        {/* Course Meta */}
                        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mb-3">
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
                        </div>

                        {/* Last Watched / Continue Info */}
                        {enrollment.last_watched_at && enrollment.progress > 0 && enrollment.progress < 100 && (
                          <div className="flex items-center gap-1 text-xs text-primary mb-2">
                            <Play className="w-3 h-3" />
                            <span>
                              মডিউল {(enrollment.last_module_index ?? 0) + 1}, লেসন {(enrollment.last_lesson_index ?? 0) + 1}
                            </span>
                          </div>
                        )}
                        
                        {/* Progress */}
                        <div className="mb-3">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-muted-foreground">অগ্রগতি</span>
                            <span className="font-medium text-primary">{enrollment.progress}%</span>
                          </div>
                          <Progress 
                            value={enrollment.progress} 
                            className="h-1.5"
                          />
                        </div>

                        <Link to={`/learn/${enrollment.course?.slug}`}>
                          <Button 
                            className={`w-full text-sm ${enrollment.progress >= 100 ? '' : 'gradient-purple text-white'}`}
                            variant={enrollment.progress >= 100 ? "outline" : "default"}
                            size="sm"
                          >
                            <Play className="w-4 h-4 mr-2" />
                            {enrollment.progress >= 100 
                              ? "আবার দেখুন" 
                              : enrollment.progress > 0 
                                ? "চালিয়ে যান" 
                                : "শুরু করুন"
                            }
                          </Button>
                        </Link>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar - Second on mobile/tablet */}
            <aside className="lg:w-72 shrink-0 space-y-4 order-2 lg:order-1">
              {/* Stats Card */}
              <Card className="p-4">
                <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-primary" />
                  কোর্স স্ট্যাটিস্টিক্স
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">মোট কোর্স</span>
                    <span className="font-semibold text-primary">{totalCourses}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">চলমান</span>
                    <span className="font-semibold text-amber-500">{inProgressCourses}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">সম্পন্ন</span>
                    <span className="font-semibold text-green-500">{completedCourses}</span>
                  </div>
                </div>
              </Card>

              {/* Recent Orders Card - Only show if user has enrollments OR pending orders */}
              {(totalCourses > 0 || (orders && orders.some(o => o.status === 'পেন্ডিং'))) && (
                <Card className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-sm flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4 text-primary" />
                      সাম্প্রতিক অর্ডার
                    </h3>
                    <Link to="/my-orders" className="text-xs text-primary hover:underline">
                      সব দেখুন
                    </Link>
                  </div>
                  
                  {ordersLoading ? (
                    <div className="flex justify-center py-4">
                      <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                    </div>
                  ) : orders && orders.length > 0 ? (
                    <div className="space-y-3">
                      {orders.slice(0, 3).map((order) => (
                        <div key={order.id} className="border-b border-border pb-3 last:border-0 last:pb-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <span className="font-mono text-xs text-muted-foreground">
                              {order.order_number}
                            </span>
                            {getStatusBadge(order.status)}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(order.created_at)}
                          </p>
                          <p className="text-sm font-semibold text-primary mt-1">
                            {order.total_amount.toLocaleString()}৳
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <Package className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-xs text-muted-foreground">কোনো অর্ডার নেই</p>
                    </div>
                  )}
                </Card>
              )}

              {/* Popular Courses Card */}
              <Card className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-sm flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-500" />
                    জনপ্রিয় কোর্স
                  </h3>
                </div>
                
                {coursesError ? (
                  <div className="text-center py-4">
                    <p className="text-xs text-muted-foreground mb-2">কোর্স লোড করতে সমস্যা হয়েছে</p>
                    <Button variant="outline" size="sm" onClick={() => void refetchCourses()} disabled={coursesFetching}>
                      আবার চেষ্টা করুন
                    </Button>
                  </div>
                ) : popularCourses && popularCourses.length > 0 ? (
                  <div className="space-y-3">
                    {popularCourses.map((course) => (
                      <Link 
                        key={course.id} 
                        to={`/courses/${course.slug}`}
                        className="block group"
                      >
                        <div className="flex gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                          <img
                            src={course.image_url || '/placeholder.svg'}
                            alt={course.title}
                            className="w-14 h-10 object-cover rounded"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-xs line-clamp-2 group-hover:text-primary transition-colors">
                              {course.title}
                            </h4>
                            <p className="text-primary font-semibold text-xs mt-0.5">
                              {course.is_free ? 'ফ্রি' : `৳${course.price.toLocaleString()}`}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                    <Link to="/courses">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full mt-2 text-xs"
                      >
                        সব কোর্স দেখুন
                        <ArrowRight className="w-3 h-3 ml-1" />
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <BookOpen className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-xs text-muted-foreground">কোনো কোর্স নেই</p>
                  </div>
                )}
              </Card>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MyCourses;
