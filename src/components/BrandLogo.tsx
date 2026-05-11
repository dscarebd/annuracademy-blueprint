import logoIcon from "@/assets/logo-icon.png";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  variant?: "header" | "footer";
  className?: string;
}

const BrandLogo = ({ variant = "header", className }: BrandLogoProps) => {
  const isFooter = variant === "footer";

  return (
    <span className={cn("inline-flex items-center gap-2 sm:gap-2.5", className)}>
      <img
        src={logoIcon}
        alt="An-Nur Academy"
        className={cn(
          "w-auto object-contain shrink-0",
          isFooter ? "h-11 md:h-12" : "h-8 sm:h-9 md:h-10"
        )}
      />
      <span className="flex flex-col">
        <span
          className={cn(
            "font-bold tracking-tight leading-none",
            isFooter ? "text-xl md:text-2xl" : "text-base sm:text-lg md:text-xl"
          )}
        >
          <span className="text-foreground">An-Nur</span>{" "}
          <span className="text-primary">Academy</span>
        </span>
        <span
          className={cn(
            "text-muted-foreground font-light tracking-wide whitespace-nowrap mt-0.5",
            isFooter
              ? "text-[11px] md:text-xs"
              : "hidden sm:block text-[10px] md:text-[11px]"
          )}
        >
          Bangladesh's AI Learning Platform
        </span>
      </span>
    </span>
  );
};

export default BrandLogo;
