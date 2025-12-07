import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  Tag, 
  X, 
  Loader2, 
  Check, 
  User, 
  ShieldCheck, 
  Copy, 
  Clock,
  CreditCard,
  CheckCircle2,
  ChevronRight
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { checkoutFormSchema, loggedInCheckoutFormSchema } from "@/lib/validation";
import { useValidateCoupon, useIncrementCouponUsage, Coupon } from "@/hooks/useCoupons";
import { useAuth } from "@/hooks/useAuth";
import { usePaymentMethods, PaymentMethod } from "@/hooks/usePaymentMethods";

const Payment = () => {
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
  const [step, setStep] = useState<'info' | 'payment'>('info');
  const [copied, setCopied] = useState(false);
  
  // Auto-fill user data when logged in
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        email: user.email || "",
        name: user.user_metadata?.full_name || user.user_metadata?.name || "",
      }));
      setStep('payment');
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

  const copyNumber = () => {
    if (selectedPaymentMethod) {
      navigator.clipboard.writeText(selectedPaymentMethod.number);
      setCopied(true);
      toast({ title: "নম্বর কপি হয়েছে" });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleProceedToPayment = () => {
    if (!user) {
      // Validate user info first
      const validation = checkoutFormSchema.omit({ transactionId: true }).safeParse({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
      });
      
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
    setFieldErrors({});
    setStep('payment');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    
    // Validate transaction ID
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
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <CreditCard className="w-10 h-10 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold mb-2">আপনার কার্ট খালি</h2>
          <p className="text-muted-foreground mb-6">পেমেন্ট করতে প্রথমে কোর্স যোগ করুন</p>
          <Link to="/courses">
            <Button className="w-full">কোর্স দেখুন</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10">
      {/* Header */}
      <header className="bg-card border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/cart" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">কার্টে ফিরুন</span>
            </Link>
            <div className="flex items-center gap-2">
              <div className="gradient-purple w-8 h-8 rounded-lg flex items-center justify-center">
                <CreditCard className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg">পেমেন্ট</span>
            </div>
            <div className="flex items-center gap-1.5 text-green-600">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-xs font-medium hidden sm:inline">সিকিউর পেমেন্ট</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 md:py-10 max-w-5xl">
        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className={`flex items-center gap-2 ${step === 'info' ? 'text-primary' : 'text-muted-foreground'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step === 'payment' ? 'bg-green-500 text-white' : step === 'info' ? 'gradient-purple text-white' : 'bg-muted'
            }`}>
              {step === 'payment' ? <Check className="w-4 h-4" /> : '১'}
            </div>
            <span className="hidden sm:inline font-medium">তথ্য</span>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
          <div className={`flex items-center gap-2 ${step === 'payment' ? 'text-primary' : 'text-muted-foreground'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step === 'payment' ? 'gradient-purple text-white' : 'bg-muted'
            }`}>
              ২
            </div>
            <span className="hidden sm:inline font-medium">পেমেন্ট</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {step === 'info' && !user && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  আপনার তথ্য দিন
                </h2>
                <div className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">নাম <span className="text-destructive">*</span></Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="পুরো নাম"
                        className={fieldErrors.name ? "border-destructive" : ""}
                      />
                      {fieldErrors.name && (
                        <p className="text-sm text-destructive mt-1">{fieldErrors.name}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="phone">মোবাইল <span className="text-destructive">*</span></Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="01XXXXXXXXX"
                        className={fieldErrors.phone ? "border-destructive" : ""}
                      />
                      {fieldErrors.phone && (
                        <p className="text-sm text-destructive mt-1">{fieldErrors.phone}</p>
                      )}
                    </div>
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
                      placeholder="কমপক্ষে ৬ অক্ষর"
                      className={fieldErrors.password ? "border-destructive" : ""}
                    />
                    {fieldErrors.password && (
                      <p className="text-sm text-destructive mt-1">{fieldErrors.password}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      এই পাসওয়ার্ড দিয়ে পরে লগইন করতে পারবেন
                    </p>
                  </div>
                  <Button onClick={handleProceedToPayment} className="w-full mt-4" size="lg">
                    পেমেন্টে যান
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                  <p className="text-center text-sm text-muted-foreground">
                    ইতিমধ্যে অ্যাকাউন্ট আছে? <Link to="/student-login" className="text-primary hover:underline">লগইন করুন</Link>
                  </p>
                </div>
              </Card>
            )}

            {step === 'payment' && (
              <>
                {/* Logged in user info */}
                {user && (
                  <Card className="p-4 bg-green-50 border-green-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-green-800">লগইনড একাউন্ট</p>
                        <p className="text-sm text-green-600">{user.email}</p>
                      </div>
                    </div>
                  </Card>
                )}

                {/* Payment Methods */}
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-primary" />
                    পেমেন্ট মেথড সিলেক্ট করুন
                  </h2>
                  
                  {paymentMethodsLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                  ) : paymentMethods && paymentMethods.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {paymentMethods.map((method) => (
                        <button
                          key={method.id}
                          type="button"
                          onClick={() => setSelectedPaymentMethod(method)}
                          className={`relative flex flex-col items-center p-4 rounded-xl border-2 transition-all ${
                            selectedPaymentMethod?.id === method.id 
                              ? "border-primary bg-primary/5 shadow-lg shadow-primary/10" 
                              : "border-border hover:border-primary/50 hover:bg-muted/50"
                          }`}
                        >
                          {selectedPaymentMethod?.id === method.id && (
                            <div className="absolute -top-2 -right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                              <Check className="w-3 h-3 text-white" />
                            </div>
                          )}
                          {method.icon_url ? (
                            <img
                              src={method.icon_url}
                              alt={method.name}
                              className="w-12 h-12 object-contain"
                            />
                          ) : (
                            <div className={`w-12 h-12 ${method.color} rounded-xl flex items-center justify-center text-white text-lg font-bold`}>
                              {method.name.charAt(0)}
                            </div>
                          )}
                          <span className="text-sm font-medium mt-2">{method.name}</span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-4">কোনো পেমেন্ট মেথড পাওয়া যায়নি</p>
                  )}
                </Card>

                {/* Payment Instructions */}
                {selectedPaymentMethod && (
                  <Card className="p-6 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-primary" />
                      পেমেন্ট নির্দেশনা
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-4 bg-card rounded-xl border">
                        {selectedPaymentMethod.icon_url ? (
                          <img src={selectedPaymentMethod.icon_url} alt={selectedPaymentMethod.name} className="w-10 h-10 object-contain" />
                        ) : (
                          <div className={`w-10 h-10 ${selectedPaymentMethod.color} rounded-lg flex items-center justify-center text-white font-bold`}>
                            {selectedPaymentMethod.name.charAt(0)}
                          </div>
                        )}
                        <div className="flex-1">
                          <p className="text-sm text-muted-foreground">Send Money করুন</p>
                          <p className="text-xl font-bold font-mono">{selectedPaymentMethod.number}</p>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={copyNumber}
                          className="shrink-0"
                        >
                          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </Button>
                      </div>

                      <ol className="space-y-2 text-sm">
                        <li className="flex items-start gap-3">
                          <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-medium shrink-0">১</span>
                          <span>{selectedPaymentMethod.name} অ্যাপ ওপেন করুন</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-medium shrink-0">২</span>
                          <span>"Send Money" অপশনে ক্লিক করুন</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-medium shrink-0">৩</span>
                          <span>উপরের নম্বরে <strong className="text-primary">{finalPrice.toLocaleString()}৳</strong> পাঠান</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-medium shrink-0">৪</span>
                          <span>Transaction ID নিচে দিয়ে সাবমিট করুন</span>
                        </li>
                      </ol>
                    </div>
                  </Card>
                )}

                {/* Transaction ID Form */}
                <Card className="p-6">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="transactionId" className="text-base font-medium">
                        Transaction ID <span className="text-destructive">*</span>
                      </Label>
                      <p className="text-sm text-muted-foreground mb-2">
                        পেমেন্ট করার পর প্রাপ্ত Transaction ID দিন
                      </p>
                      <Input
                        id="transactionId"
                        name="transactionId"
                        value={formData.transactionId}
                        onChange={handleInputChange}
                        placeholder="যেমন: TRX1234567890"
                        className={`h-12 text-lg ${fieldErrors.transactionId ? "border-destructive" : ""}`}
                      />
                      {fieldErrors.transactionId && (
                        <p className="text-sm text-destructive mt-1">{fieldErrors.transactionId}</p>
                      )}
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full h-12 text-base gradient-purple border-0" 
                      size="lg" 
                      disabled={isProcessing || !selectedPaymentMethod}
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin mr-2" />
                          প্রসেসিং...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-5 h-5 mr-2" />
                          পেমেন্ট কনফার্ম করুন
                        </>
                      )}
                    </Button>
                  </form>
                </Card>
              </>
            )}
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-2">
            <div className="sticky top-24 space-y-4">
              <Card className="p-6">
                <h2 className="text-lg font-semibold mb-4">অর্ডার সামারি</h2>
                
                <div className="space-y-3 mb-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-16 h-12 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium line-clamp-2">{item.title}</p>
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
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleRemoveCoupon}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 h-7 w-7 p-0"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                          placeholder="কুপন কোড"
                          className="pl-9 uppercase"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleApplyCoupon}
                        disabled={validateCoupon.isPending || !couponCode.trim()}
                        className="shrink-0"
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
                    <span className="text-muted-foreground">সাবটোটাল</span>
                    <span>{totalPrice.toLocaleString()}৳</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>ডিসকাউন্ট</span>
                      <span>-{discount.toLocaleString()}৳</span>
                    </div>
                  )}
                  <div className="flex justify-between text-xl font-bold pt-3 border-t">
                    <span>মোট</span>
                    <span className="text-primary">{finalPrice.toLocaleString()}৳</span>
                  </div>
                </div>
              </Card>

              {/* Security Badge */}
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">১০০% সিকিউর পেমেন্ট</p>
                    <p className="text-xs text-muted-foreground">আপনার তথ্য সম্পূর্ণ নিরাপদ</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Payment;
