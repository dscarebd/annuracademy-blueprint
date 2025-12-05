import { Widget } from "./WidgetTypes";
import { Button } from "@/components/ui/button";

interface WidgetRendererProps {
  widget: Widget;
  isSelected: boolean;
  onSelect: () => void;
}

export const WidgetRenderer = ({ widget, isSelected, onSelect }: WidgetRendererProps) => {
  const renderWidget = () => {
    switch (widget.type) {
      case "text":
        return (
          <p
            className={`${getFontSize(widget.data.fontSize)} ${getFontWeight(widget.data.fontWeight)} ${getTextAlign(widget.data.textAlign)}`}
          >
            {widget.data.text}
          </p>
        );

      case "heading":
        const HeadingTag = widget.data.level || "h2";
        const headingClasses = {
          h1: "text-4xl font-bold",
          h2: "text-3xl font-bold",
          h3: "text-2xl font-semibold",
          h4: "text-xl font-semibold",
          h5: "text-lg font-medium",
          h6: "text-base font-medium",
        };
        return (
          <HeadingTag
            className={`${headingClasses[HeadingTag as keyof typeof headingClasses]} ${getTextAlign(widget.data.textAlign)}`}
          >
            {widget.data.text}
          </HeadingTag>
        );

      case "image":
        return widget.data.src ? (
          <img
            src={widget.data.src}
            alt={widget.data.alt || ""}
            className={`${getWidth(widget.data.width)} ${getRounded(widget.data.rounded)} object-cover`}
          />
        ) : (
          <div className="w-full h-32 bg-muted rounded-lg flex items-center justify-center border-2 border-dashed">
            <span className="text-sm text-muted-foreground">ছবি সিলেক্ট করুন</span>
          </div>
        );

      case "button":
        return (
          <Button
            variant={widget.data.variant === "primary" ? "default" : widget.data.variant}
            size={widget.data.size}
            className="pointer-events-none"
          >
            {widget.data.text}
          </Button>
        );

      case "spacer":
        return (
          <div
            style={{ height: `${widget.data.height}px` }}
            className="w-full bg-muted/30 rounded border border-dashed border-muted-foreground/20"
          />
        );

      case "divider":
        return (
          <hr
            className={`border-t ${widget.data.style === "dashed" ? "border-dashed" : ""} border-${widget.data.color}`}
          />
        );

      case "video":
        return widget.data.url ? (
          <div className="aspect-video bg-black rounded-lg overflow-hidden">
            <iframe
              src={getEmbedUrl(widget.data.url)}
              className="w-full h-full"
              allowFullScreen
            />
          </div>
        ) : (
          <div className="aspect-video bg-muted rounded-lg flex items-center justify-center border-2 border-dashed">
            <span className="text-sm text-muted-foreground">ভিডিও URL দিন</span>
          </div>
        );

      default:
        return (
          <div className="p-4 bg-muted rounded-lg">
            <span className="text-sm text-muted-foreground">Unknown widget: {widget.type}</span>
          </div>
        );
    }
  };

  return (
    <div
      onClick={onSelect}
      className={`relative group cursor-pointer transition-all ${
        isSelected ? "ring-2 ring-primary ring-offset-2 rounded-lg" : ""
      }`}
    >
      {renderWidget()}
      {!isSelected && (
        <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary/50 rounded-lg transition-all pointer-events-none" />
      )}
    </div>
  );
};

// Helper functions
const getFontSize = (size: string) => {
  const sizes: Record<string, string> = {
    xs: "text-xs",
    sm: "text-sm",
    base: "text-base",
    lg: "text-lg",
    xl: "text-xl",
    "2xl": "text-2xl",
  };
  return sizes[size] || "text-base";
};

const getFontWeight = (weight: string) => {
  const weights: Record<string, string> = {
    normal: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold",
    bold: "font-bold",
  };
  return weights[weight] || "font-normal";
};

const getTextAlign = (align: string) => {
  const aligns: Record<string, string> = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };
  return aligns[align] || "text-left";
};

const getWidth = (width: string) => {
  const widths: Record<string, string> = {
    auto: "w-auto",
    full: "w-full",
    half: "w-1/2",
  };
  return widths[width] || "w-full";
};

const getRounded = (rounded: string) => {
  const roundedValues: Record<string, string> = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    full: "rounded-full",
  };
  return roundedValues[rounded] || "rounded-lg";
};

const getEmbedUrl = (url: string) => {
  // Convert YouTube URLs to embed format
  const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  if (youtubeMatch) {
    return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
  }
  return url;
};
