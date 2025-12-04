import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useUserOrders } from "@/hooks/useUserOrders";
import { 
  ArrowLeft, 
  Package, 
  Clock, 
  CheckCircle2, 
  XCircle,
  ShoppingBag,
  Loader2
} from "lucide-react";

const MyOrders = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const { data: orders, isLoading, error } = useUserOrders();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/student-login");
      } else {
        setIsAuthenticated(true);
      }
    };
    checkAuth();
  }, [navigate]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("bn-BD", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "কনফার্মড":
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            কনফার্মড
          </Badge>
        );
      case "বাতিল":
        return (
          <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
            <XCircle className="w-3 h-3 mr-1" />
            বাতিল
          </Badge>
        );
      default:
        return (
          <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
            <Clock className="w-3 h-3 mr-1" />
            পেন্ডিং
          </Badge>
        );
    }
  };

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
        <section className="bg-gradient-to-br from-primary/10 via-background to-primary/5 py-8 md:py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground text-center">
              আমার অর্ডার সমূহ
            </h1>
            <p className="text-muted-foreground text-center mt-2">
              আপনার সকল অর্ডারের বিস্তারিত তথ্য
            </p>
          </div>
        </section>

        <section className="py-8 md:py-12">
          <div className="container mx-auto px-4 max-w-4xl">
            <Link 
              to="/my-courses" 
              className="inline-flex items-center gap-2 text-primary hover:underline mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              আমার কোর্সে ফিরে যান
            </Link>

            {error ? (
              <Card className="p-8 text-center">
                <XCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">কিছু সমস্যা হয়েছে</h2>
                <p className="text-muted-foreground">দয়া করে পরে আবার চেষ্টা করুন</p>
              </Card>
            ) : orders && orders.length === 0 ? (
              <Card className="p-8 text-center">
                <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">কোনো অর্ডার নেই</h2>
                <p className="text-muted-foreground mb-4">
                  আপনি এখনো কোনো কোর্স কেনেননি
                </p>
                <Link to="/courses">
                  <Button>কোর্স দেখুন</Button>
                </Link>
              </Card>
            ) : (
              <div className="space-y-4">
                {orders?.map((order) => (
                  <Card key={order.id} className="p-4 md:p-6">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Package className="w-4 h-4 text-primary" />
                          <span className="font-mono font-semibold text-sm">
                            {order.order_number}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(order.created_at)}
                        </p>
                      </div>
                      {getStatusBadge(order.status)}
                    </div>

                    <div className="border-t pt-4 space-y-3">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex gap-3">
                          {item.image && (
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-16 h-12 object-cover rounded"
                            />
                          )}
                          <div className="flex-grow">
                            <p className="font-medium line-clamp-1">{item.title}</p>
                            <p className="text-sm text-primary font-semibold">
                              {item.price.toLocaleString()}৳
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t mt-4 pt-4 flex flex-col md:flex-row md:items-center justify-between gap-2">
                      <div className="text-sm text-muted-foreground">
                        <span>পেমেন্ট: </span>
                        <span className="font-medium text-foreground">
                          {order.payment_method}
                        </span>
                        <span className="mx-2">•</span>
                        <span>TxID: </span>
                        <span className="font-mono font-medium text-foreground">
                          {order.transaction_id}
                        </span>
                      </div>
                      <div className="text-lg font-bold text-primary">
                        মোট: {order.total_amount.toLocaleString()}৳
                      </div>
                    </div>

                    {order.status === "কনফার্মড" && (
                      <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm text-green-700">
                          ✓ আপনার কোর্স অ্যাক্সেস চালু হয়েছে। "আমার কোর্স" পেজ থেকে শিখতে শুরু করুন।
                        </p>
                      </div>
                    )}

                    {order.status === "পেন্ডিং" && (
                      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-sm text-yellow-700">
                          ⏳ আপনার পেমেন্ট যাচাই করা হচ্ছে। সাধারণত ২৪ ঘন্টার মধ্যে কনফার্ম হয়।
                        </p>
                      </div>
                    )}
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

export default MyOrders;
