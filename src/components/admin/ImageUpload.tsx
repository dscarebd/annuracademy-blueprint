import { useState, useRef, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Upload, X, Image as ImageIcon, Link, Info, Ruler } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  bucket?: string;
  folder?: string;
  /** Recommended image size hint, e.g. "1920x1080", "400x400" */
  sizeHint?: string;
  /** Aspect ratio hint, e.g. "16:9", "1:1", "4:3" */
  aspectRatio?: string;
}

export const ImageUpload = ({ 
  value, 
  onChange, 
  bucket = "site-content",
  folder = "images",
  sizeHint,
  aspectRatio
}: ImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [urlInput, setUrlInput] = useState(value);
  const [activeTab, setActiveTab] = useState<string>(value ? "preview" : "upload");
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get actual image dimensions when value changes
  useEffect(() => {
    if (value) {
      const img = new Image();
      img.onload = () => {
        setImageDimensions({ width: img.naturalWidth, height: img.naturalHeight });
      };
      img.onerror = () => {
        setImageDimensions(null);
      };
      img.src = value;
    } else {
      setImageDimensions(null);
    }
  }, [value]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("শুধুমাত্র ছবি আপলোড করা যাবে");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("ছবির সাইজ ৫MB এর বেশি হতে পারবে না");
      return;
    }

    setIsUploading(true);

    try {
      // Generate unique filename
      const fileExt = file.name.split(".").pop();
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) throw error;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);

      onChange(urlData.publicUrl);
      setUrlInput(urlData.publicUrl);
      setActiveTab("preview");
      toast.success("ছবি আপলোড হয়েছে!");
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error.message || "আপলোড করা যায়নি");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim());
      setActiveTab("preview");
    }
  };

  const handleRemove = () => {
    onChange("");
    setUrlInput("");
    setActiveTab("upload");
  };

  const SizeHintBadge = () => {
    if (!sizeHint && !aspectRatio) return null;
    
    return (
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-md">
        <Info className="w-3 h-3" />
        <span>
          প্রস্তাবিত: {sizeHint && <strong>{sizeHint}px</strong>}
          {sizeHint && aspectRatio && " • "}
          {aspectRatio && <span>অনুপাত {aspectRatio}</span>}
        </span>
      </div>
    );
  };

  const ImageDimensionsBadge = () => {
    if (!imageDimensions) return null;
    
    const isMatchingSizeHint = sizeHint && 
      `${imageDimensions.width}x${imageDimensions.height}` === sizeHint;
    
    return (
      <div className={`flex items-center gap-1.5 text-xs px-2 py-1 rounded-md ${
        isMatchingSizeHint 
          ? 'bg-green-500/10 text-green-600' 
          : 'bg-orange-500/10 text-orange-600'
      }`}>
        <Ruler className="w-3 h-3" />
        <span>
          বর্তমান: <strong>{imageDimensions.width} × {imageDimensions.height}px</strong>
        </span>
      </div>
    );
  };

  const CurrentImagePreview = () => {
    if (!value) return null;
    
    return (
      <div className="p-3 bg-muted/50 rounded-lg border border-border/50">
        <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
          <ImageIcon className="w-3 h-3" />
          বর্তমান ছবি:
        </p>
        <div className="flex items-start gap-3">
          <div className="relative w-20 h-20 rounded-md overflow-hidden bg-background border shrink-0">
            <img
              src={value}
              alt="Current"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/placeholder.svg";
              }}
            />
          </div>
          <div className="flex-1 min-w-0 space-y-1">
            <p className="text-xs text-muted-foreground truncate">{value}</p>
            {imageDimensions && (
              <div className="flex flex-wrap gap-2">
                <ImageDimensionsBadge />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-3">
      {/* Size hint badge */}
      <SizeHintBadge />
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 h-9">
          <TabsTrigger value="preview" className="text-xs gap-1" disabled={!value}>
            <ImageIcon className="w-3 h-3" />
            প্রিভিউ
          </TabsTrigger>
          <TabsTrigger value="upload" className="text-xs gap-1">
            <Upload className="w-3 h-3" />
            আপলোড
          </TabsTrigger>
          <TabsTrigger value="url" className="text-xs gap-1">
            <Link className="w-3 h-3" />
            URL
          </TabsTrigger>
        </TabsList>

        <TabsContent value="preview" className="mt-3">
          {value ? (
            <div className="relative group">
              <div className="border rounded-lg overflow-hidden bg-muted aspect-video max-w-md">
                <img
                  src={value}
                  alt="Current image"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/placeholder.svg";
                  }}
                />
              </div>
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={handleRemove}
              >
                <X className="w-4 h-4" />
              </Button>
              
              {/* Image info section */}
              <div className="mt-3 space-y-2">
                <div className="flex flex-wrap gap-2">
                  <ImageDimensionsBadge />
                </div>
                <p className="text-xs text-muted-foreground truncate max-w-md">
                  {value}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              কোনো ছবি নেই
            </div>
          )}
        </TabsContent>

        <TabsContent value="upload" className="mt-3 space-y-3">
          {/* Show current image preview at top */}
          <CurrentImagePreview />
          
          <div 
            className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            {isUploading ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">আপলোড হচ্ছে...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Upload className="w-8 h-8 text-muted-foreground" />
                <p className="text-sm font-medium">{value ? 'নতুন ছবি আপলোড করুন' : 'ছবি আপলোড করুন'}</p>
                <p className="text-xs text-muted-foreground">PNG, JPG, GIF (সর্বোচ্চ ৫MB)</p>
                {sizeHint && (
                  <p className="text-xs text-primary font-medium">প্রস্তাবিত সাইজ: {sizeHint}px</p>
                )}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="url" className="mt-3 space-y-3">
          {/* Show current image preview at top */}
          <CurrentImagePreview />
          
          <div className="flex gap-2">
            <Input
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="flex-1"
            />
            <Button onClick={handleUrlSubmit} disabled={!urlInput.trim()}>
              সেট করুন
            </Button>
          </div>
          
          {urlInput && urlInput !== value && (
            <div className="p-2 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground mb-2">প্রিভিউ:</p>
              <img
                src={urlInput}
                alt="URL Preview"
                className="max-h-32 object-contain rounded"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};