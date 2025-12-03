import { ShoppingCart, Trash2, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="relative gradient-purple text-white font-semibold hover:opacity-90 px-4 py-2 rounded-md flex items-center gap-2">
          <ShoppingCart className="w-5 h-5" />
          <span>কার্ট</span>
          {itemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-white text-primary text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-sm">
              {itemCount}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4 border-b">
          <h4 className="font-semibold flex items-center gap-2">
            <ShoppingBag className="w-4 h-4" />
            আপনার কার্ট ({itemCount})
          </h4>
        </div>

        {items.length === 0 ? (
          <div className="p-6 text-center">
            <ShoppingCart className="w-10 h-10 text-muted-foreground/50 mx-auto mb-2" />
            <p className="text-muted-foreground text-sm">আপনার কার্ট খালি</p>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="max-h-64 overflow-y-auto p-2 space-y-2">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-2 p-2 bg-muted/30 rounded-lg"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-14 h-10 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-xs line-clamp-1">
                      {item.title}
                    </h4>
                    <p className="text-primary font-semibold text-xs mt-0.5">
                      ৳{item.price.toLocaleString()}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-destructive hover:text-destructive"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t p-3 space-y-3">
              <div className="flex justify-between items-center font-semibold">
                <span className="text-sm">মোট:</span>
                <span className="text-primary">৳{totalPrice.toLocaleString()}</span>
              </div>
              <Button
                className="w-full gradient-purple text-white hover:opacity-90"
                size="sm"
                onClick={handleCheckout}
              >
                চেকআউট করুন
              </Button>
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default CartSidebar;
