import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trash2, ShoppingBag, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";

const Cart = () => {
  const { items, removeFromCart, totalPrice } = useCart();
  const navigate = useNavigate();

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
            <h1 className="text-3xl md:text-4xl font-bold text-foreground text-center">
              কার্ট
            </h1>
          </div>
        </section>

        <section className="py-8 md:py-12">
          <div className="container mx-auto px-4 max-w-4xl">
            {items.length === 0 ? (
              <div className="text-center py-16">
                <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  আপনার কার্ট খালি
                </h2>
                <p className="text-muted-foreground mb-6">
                  আমাদের কোর্স দেখুন এবং পছন্দের কোর্স কার্টে যোগ করুন
                </p>
                <Link to="/courses">
                  <Button>কোর্স দেখুন</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Cart Items */}
                <div className="space-y-4">
                  {items.map((item) => (
                    <Card key={item.id} className="p-4">
                      <div className="flex gap-4">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-24 h-16 object-cover rounded"
                        />
                        <div className="flex-grow">
                          <h3 className="font-semibold text-foreground">
                            {item.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {item.instructor} • {item.category}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-bold text-foreground">
                            {item.price.toLocaleString()}৳
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeFromCart(item.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Summary */}
                <Card className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold">মোট:</span>
                    <span className="text-2xl font-bold text-primary">
                      {totalPrice.toLocaleString()}৳
                    </span>
                  </div>
                  <Link to="/checkout">
                    <Button className="w-full" size="lg">
                      চেকআউট করুন
                    </Button>
                  </Link>
                </Card>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Cart;
