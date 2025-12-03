import { useState } from "react";
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
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { checkoutFormSchema } from "@/lib/validation";

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [paymentMethod, setPaymentMethod] = useState("bkash");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    transactionId: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const paymentDetails = {
    bkash: { name: "বিকাশ", number: "01XXXXXXXXX", color: "bg-pink-500" },
    nagad: { name: "নগদ", number: "01XXXXXXXXX", color: "bg-orange-500" },
    rocket: { name: "রকেট", number: "01XXXXXXXXX", color: "bg-purple-600" },
  };

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    
    // Validate with zod
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
          customer_name: formData.name,
          customer_email: formData.email,
          customer_phone: formData.phone,
          payment_method: paymentDetails[paymentMethod as keyof typeof paymentDetails].name,
          transaction_id: formData.transactionId,
          total_amount: totalPrice,
          items: orderItems,
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
                {/* Personal Info Card */}
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

                  <div className="border-t pt-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span>মোট:</span>
                      <span className="text-primary">{totalPrice.toLocaleString()}৳</span>
                    </div>
                  </div>
                </Card>

                {/* Payment Method Card */}
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-4">পেমেন্ট মেথড</h2>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <RadioGroup
                      value={paymentMethod}
                      onValueChange={setPaymentMethod}
                      className="space-y-3"
                    >
                      {Object.entries(paymentDetails).map(([key, value]) => (
                        <div
                          key={key}
                          className={`flex items-center space-x-3 p-3 rounded-lg border ${
                            paymentMethod === key ? "border-primary bg-primary/5" : "border-border"
                          }`}
                        >
                          <RadioGroupItem value={key} id={key} />
                          <Label htmlFor={key} className="flex items-center gap-2 cursor-pointer">
                            <span className={`w-8 h-8 ${value.color} rounded-full flex items-center justify-center text-white text-xs font-bold`}>
                              {value.name.charAt(0)}
                            </span>
                            {value.name}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>

                    {/* Payment Instructions */}
                    <Card className="p-4 bg-muted/50">
                      <p className="text-sm font-medium mb-2">পেমেন্ট নির্দেশনা:</p>
                      <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                        <li>
                          {paymentDetails[paymentMethod as keyof typeof paymentDetails].name} অ্যাপ ওপেন করুন
                        </li>
                        <li>Send Money অপশনে যান</li>
                        <li>
                          নম্বর: <span className="font-mono font-semibold text-foreground">
                            {paymentDetails[paymentMethod as keyof typeof paymentDetails].number}
                          </span>
                        </li>
                        <li>
                          পরিমাণ: <span className="font-semibold text-foreground">{totalPrice.toLocaleString()}৳</span>
                        </li>
                        <li>পেমেন্ট সম্পন্ন করে Transaction ID কপি করুন</li>
                      </ol>
                    </Card>

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

                    <Button type="submit" className="w-full" size="lg" disabled={isProcessing}>
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
