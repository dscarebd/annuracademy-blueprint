import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Tag, X, Loader2, Check, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { checkoutFormSchema, loggedInCheckoutFormSchema } from "@/lib/validation";
import { useValidateCoupon, useIncrementCouponUsage, Coupon } from "@/hooks/useCoupons";
import { useAuth } from "@/hooks/useAuth";
import { usePaymentMethods, PaymentMethod } from "@/hooks/usePaymentMethods";

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isLoading: authLoading } = useAuth();
  const { data: paymentMethods, isLoading: paymentMethodsLoading } = usePaymentMethods();
  
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    transactionId: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Auto-fill user data when logged in
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        email: user.email || "",
        name: user.user_metadata?.full_name || user.user_metadata?.name || "",
      }));
    }
  }, [user]);

  // Set default payment method when loaded
  useEffect(() => {
    if (paymentMethods && paymentMethods.length > 0 && !selectedPaymentMethod) {
      setSelectedPaymentMethod(paymentMethods[0]);
    }
  }, [paymentMethods, selectedPaymentMethod]);
  
  // Coupon state
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const validateCoupon = useValidateCoupon();
  const incrementCouponUsage = useIncrementCouponUsage();

  // Calculate discount
  const calculateDiscount = () => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.discount_type === "percentage") {
      return Math.round((totalPrice * appliedCoupon.discount_value) / 100);
    }
    return appliedCoupon.discount_value;
  };

  const discount = calculateDiscount();
  const finalPrice = totalPrice - discount;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    
    try {
      const coupon = await validateCoupon.mutateAsync({
        code: couponCode,
        orderAmount: totalPrice,
      });
      setAppliedCoupon(coupon);
      toast({ title: "কুপন প্রয়োগ করা হয়েছে" });
    } catch (error: any) {
      toast({
        title: "কুপন প্রয়োগ করা যায়নি",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
  };


  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    
    // Different validation for logged-in vs guest users
    if (user) {
      const validation = loggedInCheckoutFormSchema.safeParse({ transactionId: formData.transactionId });
      if (!validation.success) {
        const errors: Record<string, string> = {};
        validation.error.errors.forEach((err) => {
          if (err.path[0]) {
            errors[err.path[0] as string] = err.message;
          }
        });
        setFieldErrors(errors);
        toast({
          title: "তথ্য সঠিক নয়",
          description: "দয়া করে Transaction ID সঠিকভাবে দিন",
          variant: "destructive",
        });
        return;
      }
    } else {
      const validation = checkoutFormSchema.safeParse(formData);
      if (!validation.success) {
        const errors: Record<string, string> = {};
        validation.error.errors.forEach((err) => {
          if (err.path[0]) {
            errors[err.path[0] as string] = err.message;
          }
        });
        setFieldErrors(errors);
        toast({
          title: "তথ্য সঠিক নয়",
          description: "দয়া করে সকল তথ্য সঠিকভাবে পূরণ করুন",
          variant: "destructive",
        });
        return;
      }
    }

    setIsProcessing(true);
    
    try {
      const orderItems = items.map(item => ({
        id: item.id,
        title: item.title,
        price: item.price,
        image: item.image,
      }));

      const { data, error } = await supabase.functions.invoke('create-order', {
        body: {
          customer_name: user ? (user.user_metadata?.full_name || user.email?.split('@')[0] || 'User') : formData.name,
          customer_email: user ? user.email : formData.email,
          customer_password: user ? null : formData.password,
          customer_phone: user ? null : formData.phone,
          payment_method: selectedPaymentMethod?.name || 'Unknown',
          transaction_id: formData.transactionId,
          total_amount: finalPrice,
          items: orderItems,
          coupon_code: appliedCoupon?.code || null,
          discount_amount: discount,
          user_id: user?.id || null,
        },
      });

      if (error || (data && data.error)) {
        toast({
          title: "অর্ডার সেভ করতে সমস্যা হয়েছে",
          description: data?.error || "দয়া করে আবার চেষ্টা করুন",
          variant: "destructive",
        });
        return;
      }

      // Increment coupon usage if applied
      if (appliedCoupon) {
        try {
          await incrementCouponUsage.mutateAsync(appliedCoupon.id);
        } catch (e) {
          // Non-critical, don't block order
        }
      }

      clearCart();
      navigate("/thank-you");
    } catch (error) {
      toast({
        title: "অর্ডার সেভ করতে সমস্যা হয়েছে",
        description: "দয়া করে আবার চেষ্টা করুন",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-4">আপনার কার্ট খালি</h2>
            <Link to="/courses">
              <Button>কোর্স দেখুন</Button>
            </Link>
          </div>
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
              চেকআউট
            </h1>
          </div>
        </section>

        <section className="py-8 md:py-12">
          <div className="container mx-auto px-4 max-w-4xl">
            <Link to="/cart" className="inline-flex items-center gap-2 text-primary hover:underline mb-6">
              <ArrowLeft className="w-4 h-4" />
              কার্টে ফিরে যান
            </Link>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Left Side - Personal Info & FAQ */}
              <div className="space-y-6">
                {/* Logged-in User Info Card */}
                {user ? (
                  <Card className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold">লগইনড একাউন্ট</h2>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <div className="flex items-center gap-2 text-green-700">
                        <Check className="w-4 h-4" />
                        <span className="text-sm font-medium">আপনি লগইন অবস্থায় আছেন</span>
                      </div>
                      <p className="text-xs text-green-600 mt-1">
                        কোর্স কনফার্ম হলে স্বয়ংক্রিয়ভাবে আপনার ড্যাশবোর্ডে যুক্ত হবে
                      </p>
                    </div>
                  </Card>
                ) : (
                  /* Guest User Personal Info Card */
                  <Card className="p-6">
                    <h2 className="text-xl font-semibold mb-4">প্রয়োজনীয় তথ্য দিন</h2>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">আপনার নাম <span className="text-destructive">*</span></Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="পুরো নাম লিখুন"
                          required
                          className={fieldErrors.name ? "border-destructive" : ""}
                        />
                        {fieldErrors.name && (
                          <p className="text-sm text-destructive mt-1">{fieldErrors.name}</p>
                        )}
                      </div>
                      
                      <div>
                        <Label htmlFor="email">ইমেইল <span className="text-destructive">*</span></Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="email@example.com"
                          required
                          className={fieldErrors.email ? "border-destructive" : ""}
                        />
                        {fieldErrors.email && (
                          <p className="text-sm text-destructive mt-1">{fieldErrors.email}</p>
                        )}
                      </div>
                      
                      <div>
                        <Label htmlFor="password">পাসওয়ার্ড <span className="text-destructive">*</span></Label>
                        <Input
                          id="password"
                          name="password"
                          type="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          placeholder="কমপক্ষে ৬ অক্ষরের পাসওয়ার্ড"
                          required
                          className={fieldErrors.password ? "border-destructive" : ""}
                        />
                        {fieldErrors.password && (
                          <p className="text-sm text-destructive mt-1">{fieldErrors.password}</p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          এই পাসওয়ার্ড দিয়ে আপনি পরে লগইন করতে পারবেন
                        </p>
                      </div>
                      
                      <div>
                        <Label htmlFor="phone">মোবাইল নম্বর <span className="text-destructive">*</span></Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="01XXXXXXXXX"
                          required
                          className={fieldErrors.phone ? "border-destructive" : ""}
                        />
                        {fieldErrors.phone && (
                          <p className="text-sm text-destructive mt-1">{fieldErrors.phone}</p>
                        )}
                      </div>
                    </div>
                  </Card>
                )}

                {/* FAQ Card */}
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-4">সাধারণ জিজ্ঞাসা</h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium text-foreground">কোর্স কতদিন অ্যাক্সেস করতে পারবো?</h3>
                      <p className="text-sm text-muted-foreground mt-1">একবার কেনার পর আজীবন অ্যাক্সেস পাবেন।</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">পেমেন্ট করার পর কতক্ষণে অ্যাক্সেস পাবো?</h3>
                      <p className="text-sm text-muted-foreground mt-1">পেমেন্ট ভেরিফাই হওয়ার ২৪ ঘন্টার মধ্যে অ্যাক্সেস পাবেন।</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">সমস্যা হলে কোথায় যোগাযোগ করবো?</h3>
                      <p className="text-sm text-muted-foreground mt-1">আমাদের সাপোর্ট ইমেইল বা ফেসবুক পেজে যোগাযোগ করুন।</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">কোর্সের ভিডিও ডাউনলোড করা যাবে?</h3>
                      <p className="text-sm text-muted-foreground mt-1">না, কপিরাইট সুরক্ষার জন্য ভিডিও শুধুমাত্র অনলাইনে দেখা যাবে।</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">রিফান্ড পলিসি কি?</h3>
                      <p className="text-sm text-muted-foreground mt-1">কোর্স কেনার ৭ দিনের মধ্যে রিফান্ডের জন্য আবেদন করতে পারবেন।</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">মোবাইলে কোর্স দেখা যাবে?</h3>
                      <p className="text-sm text-muted-foreground mt-1">হ্যাঁ, যেকোনো ডিভাইস থেকে কোর্স অ্যাক্সেস করতে পারবেন।</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">সার্টিফিকেট পাওয়া যাবে?</h3>
                      <p className="text-sm text-muted-foreground mt-1">হ্যাঁ, কোর্স সম্পন্ন করার পর সার্টিফিকেট পাবেন।</p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Right Side - Order Summary & Payment Method */}
              <div className="space-y-6">
                {/* Order Summary Card */}
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-4">অর্ডার সামারি</h2>
                
                  <div className="space-y-3 mb-4">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-3">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-16 h-12 object-cover rounded"
                        />
                        <div className="flex-grow">
                          <p className="text-sm font-medium line-clamp-1">{item.title}</p>
                          <p className="text-sm text-primary font-semibold">
                            {item.price.toLocaleString()}৳
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Coupon Section */}
                  <div className="border-t pt-4 mb-4">
                    <Label className="text-sm font-medium mb-2 block">কুপন কোড</Label>
                    {appliedCoupon ? (
                      <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3">
                        <div className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-600" />
                          <span className="font-mono font-semibold text-green-700">{appliedCoupon.code}</span>
                          <span className="text-sm text-green-600">
                            ({appliedCoupon.discount_type === "percentage" 
                              ? `${appliedCoupon.discount_value}% ছাড়` 
                              : `${appliedCoupon.discount_value}৳ ছাড়`})
                          </span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={handleRemoveCoupon}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <div className="relative flex-grow">
                          <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                            placeholder="কুপন কোড লিখুন"
                            className="pl-10 uppercase"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleApplyCoupon}
                          disabled={validateCoupon.isPending || !couponCode.trim()}
                        >
                          {validateCoupon.isPending ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            "প্রয়োগ"
                          )}
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>সাবটোটাল:</span>
                      <span>{totalPrice.toLocaleString()}৳</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>ডিসকাউন্ট:</span>
                        <span>-{discount.toLocaleString()}৳</span>
                      </div>
                    )}
                    <div className="flex justify-between text-lg font-bold pt-2 border-t">
                      <span>মোট:</span>
                      <span className="text-primary">{finalPrice.toLocaleString()}৳</span>
                    </div>
                  </div>
                </Card>

                {/* Payment Method Card */}
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-4">পেমেন্ট মেথড</h2>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {paymentMethodsLoading ? (
                      <div className="flex items-center justify-center py-4">
                        <Loader2 className="w-6 h-6 animate-spin text-primary" />
                      </div>
                    ) : paymentMethods && paymentMethods.length > 0 ? (
                      <RadioGroup
                        value={selectedPaymentMethod?.id || ""}
                        onValueChange={(id) => {
                          const method = paymentMethods.find(m => m.id === id);
                          if (method) setSelectedPaymentMethod(method);
                        }}
                        className="grid grid-cols-3 gap-2"
                      >
                        {paymentMethods.map((method) => (
                          <Label
                            key={method.id}
                            htmlFor={method.id}
                            className={`flex flex-col items-center justify-center p-3 rounded-lg border cursor-pointer transition-colors ${
                              selectedPaymentMethod?.id === method.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                            }`}
                          >
                            <RadioGroupItem value={method.id} id={method.id} className="sr-only" />
                            <span className={`w-10 h-10 ${method.color} rounded-full flex items-center justify-center text-white text-sm font-bold`}>
                              {method.name.charAt(0)}
                            </span>
                            <span className="text-sm font-medium mt-1">{method.name}</span>
                          </Label>
                        ))}
                      </RadioGroup>
                    ) : (
                      <p className="text-muted-foreground text-center py-4">কোনো পেমেন্ট মেথড পাওয়া যায়নি</p>
                    )}

                    {/* Payment Instructions */}
                    {selectedPaymentMethod && (
                      <Card className="p-4 bg-muted/50">
                        <p className="text-sm font-medium mb-2">পেমেন্ট নির্দেশনা:</p>
                        <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                          <li>
                            {selectedPaymentMethod.name} অ্যাপ ওপেন করুন
                          </li>
                          <li>Send Money অপশনে যান</li>
                          <li>
                            নম্বর: <span className="font-mono font-semibold text-foreground">
                              {selectedPaymentMethod.number}
                            </span>
                          </li>
                          <li>
                            পরিমাণ: <span className="font-semibold text-foreground">{finalPrice.toLocaleString()}৳</span>
                          </li>
                          <li>পেমেন্ট সম্পন্ন করে Transaction ID কপি করুন</li>
                        </ol>
                      </Card>
                    )}

                    <div>
                      <Label htmlFor="transactionId">Transaction ID <span className="text-destructive">*</span></Label>
                      <Input
                        id="transactionId"
                        name="transactionId"
                        value={formData.transactionId}
                        onChange={handleInputChange}
                        placeholder="যেমন: TRX1234567890"
                        required
                        className={fieldErrors.transactionId ? "border-destructive" : ""}
                      />
                      {fieldErrors.transactionId && (
                        <p className="text-sm text-destructive mt-1">{fieldErrors.transactionId}</p>
                      )}
                    </div>

                    <Button type="submit" className="w-full" size="lg" disabled={isProcessing || !selectedPaymentMethod}>
                      {isProcessing ? "প্রসেসিং..." : "পেমেন্ট কনফার্ম করুন"}
                    </Button>
                  </form>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;
