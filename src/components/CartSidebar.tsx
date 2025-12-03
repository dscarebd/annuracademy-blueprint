import { ShoppingCart, X, Trash2, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useCart } from "@/context/CartContext";
import { useState } from "react";

const CartSidebar = () => {
  const { items, removeFromCart, totalPrice, itemCount } = useCart();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleCheckout = () => {
    setOpen(false);
    navigate("/checkout");
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="relative gradient-purple text-white font-semibold hover:opacity-90 px-4 py-2 rounded-md flex items-center gap-2">
          <ShoppingCart className="w-5 h-5" />
          <span>কার্ট</span>
          {itemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-white text-primary text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-sm">
              {itemCount}
            </span>
          )}
        </button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            আপনার কার্ট ({itemCount})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-10">
            <ShoppingCart className="w-16 h-16 text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground text-lg">আপনার কার্ট খালি</p>
            <p className="text-sm text-muted-foreground mt-1">
              কোর্স যোগ করতে ব্রাউজ করুন
            </p>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 p-3 bg-muted/30 rounded-lg"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-20 h-14 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm line-clamp-2">
                      {item.title}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {item.instructor}
                    </p>
                    <p className="text-primary font-semibold text-sm mt-1">
                      ৳{item.price.toLocaleString()}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t pt-4 space-y-4">
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>মোট:</span>
                <span className="text-primary">৳{totalPrice.toLocaleString()}</span>
              </div>
              <Button
                className="w-full gradient-purple text-white hover:opacity-90"
                size="lg"
                onClick={handleCheckout}
              >
                চেকআউট করুন
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartSidebar;
