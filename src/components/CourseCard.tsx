import { Star, ShoppingCart, Check, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";
import { toBanglaNumber, formatBanglaPrice } from "@/lib/utils";

interface CourseCardProps {
  id: string;
  title: string;
  image: string;
  level: string;
  rating: number;
  reviewCount: number;
  price: number;
  instructor: string;
  category: string;
  isFree?: boolean;
  studentsCount?: number;
  duration?: string;
  isPublished?: boolean;
}

const CourseCard = ({
  id,
  title,
  image,
  level,
  rating,
  reviewCount,
  price,
  instructor,
  category,
  isFree = false,
  studentsCount = 0,
  duration,
  isPublished = true,
}: CourseCardProps) => {
  const { addToCart, isInCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    if (isFree) return;
    
    addToCart({
      id,
      title,
      image,
      price,
      instructor,
      category,
    });
    
    toast({
      title: "কার্টে যোগ করা হয়েছে",
      description: title,
    });
  };

  const inCart = isInCart(id);

  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {/* Image */}
      <div className="relative overflow-hidden aspect-video">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
        {!isPublished && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="px-3 py-1 bg-white/90 text-foreground font-bold rounded-full text-sm">
              Upcoming
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 space-y-3">
        {/* Rating */}
        {isPublished && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-semibold">{toBanglaNumber(rating.toFixed(1))}</span>
            <span className="text-sm text-muted-foreground">({toBanglaNumber(reviewCount)})</span>
          </div>
        )}

        {/* Title */}
        <h3 className="font-bold text-lg line-clamp-2 group-hover:text-primary transition-colors mb-1">
          {title}
        </h3>

        {/* Students & Duration */}
        {isPublished && (
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span>{toBanglaNumber(studentsCount)} শিক্ষার্থী</span>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{duration || "০m"}</span>
            </div>
          </div>
        )}

        {/* Price & Button */}
        <div className="flex items-center justify-between pt-3 border-t">
          {!isPublished ? (
            <span className="text-muted-foreground font-bold text-lg">Upcoming</span>
          ) : isFree ? (
            <span className="text-primary font-bold text-lg">ফ্রি</span>
          ) : (
            <span className="text-primary font-bold text-lg">{formatBanglaPrice(price)}</span>
          )}
          {!isPublished ? (
            <Button size="sm" variant="outline" disabled>
              শীঘ্রই আসছে
            </Button>
          ) : isFree ? (
            <Button
              size="sm"
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-white"
            >
              এনরোল করুন
            </Button>
          ) : inCart ? (
            <Button size="sm" variant="secondary" className="gap-2" disabled>
              <Check className="w-4 h-4" />
              যোগ হয়েছে
            </Button>
          ) : (
            <Button
              size="sm"
              className="gradient-purple text-white hover:opacity-90 gap-2"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="w-4 h-4" />
              কার্টে যোগ করুন
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default CourseCard;
