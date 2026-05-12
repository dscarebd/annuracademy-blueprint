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
          isFooter ? "h-11 md:h-12" : "h-11 md:h-9 lg:h-10"
        )}
      />
      <span className="flex flex-col items-start text-left leading-none">
        <span
          className={cn(
            "font-bold tracking-tight leading-none whitespace-nowrap",
            isFooter ? "text-xl md:text-2xl" : "text-lg md:text-lg lg:text-xl"
          )}
        >
          <span className="text-foreground">An-Nur</span>{" "}
          <span className="text-primary">Academy</span>
        </span>
        <span
          className={cn(
            "text-muted-foreground font-light tracking-wide whitespace-nowrap leading-none mt-1",
            isFooter
              ? "text-[11px] md:text-xs"
              : "text-[10px] md:text-[10px] lg:text-[11px]"
          )}
        >
          Bangladesh's AI Learning Platform
        </span>
      </span>
    </span>
  );
};

export default BrandLogo;
