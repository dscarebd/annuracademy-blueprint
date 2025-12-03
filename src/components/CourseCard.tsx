import { Star, ShoppingCart, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";

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
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3">
          <span className="bg-white text-primary px-3 py-1 rounded-full text-xs font-semibold">
            {level}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-3">
        {/* Rating */}
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
          <span className="text-sm font-semibold">{rating}</span>
          <span className="text-sm text-muted-foreground">({reviewCount})</span>
        </div>

        {/* Title */}
        <h3 className="font-bold text-lg line-clamp-2 group-hover:text-primary transition-colors">
          {title}
        </h3>

        {/* Instructor & Category */}
        <p className="text-sm text-muted-foreground">
          By {instructor} · {category}
        </p>

        {/* Price & Button */}
        <div className="flex items-center justify-between pt-3 border-t">
          {isFree ? (
            <span className="text-primary font-bold text-lg">Free</span>
          ) : (
            <span className="text-primary font-bold text-lg">{price.toLocaleString()}৳</span>
          )}
          {isFree ? (
            <Button
              size="sm"
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-white"
            >
              Enroll
            </Button>
          ) : inCart ? (
            <Button size="sm" variant="secondary" className="gap-2" disabled>
              <Check className="w-4 h-4" />
              Added
            </Button>
          ) : (
            <Button
              size="sm"
              className="gradient-purple text-white hover:opacity-90"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default CourseCard;
