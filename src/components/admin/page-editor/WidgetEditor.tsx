import { Widget } from "./WidgetTypes";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, X, Trash2 } from "lucide-react";
import { useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface WidgetEditorProps {
  widget: Widget;
  onChange: (data: Record<string, any>) => void;
  onDelete: () => void;
}

export const WidgetEditor = ({ widget, onChange, onDelete }: WidgetEditorProps) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleChange = (key: string, value: any) => {
    onChange({ ...widget.data, [key]: value });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({ title: "শুধুমাত্র ইমেজ ফাইল আপলোড করুন", variant: "destructive" });
      return;
    }

    setIsUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `widget-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(fileName);

      handleChange("src", publicUrl);
      toast({ title: "ছবি আপলোড হয়েছে" });
    } catch (error: any) {
      toast({ title: "ছবি আপলোড ব্যর্থ", variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  };

  const renderEditor = () => {
    switch (widget.type) {
      case "text":
        return (
          <div className="space-y-4">
            <div>
              <Label>টেক্সট</Label>
              <Textarea
                value={widget.data.text}
                onChange={(e) => handleChange("text", e.target.value)}
                rows={4}
                className="mt-1.5"
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label>ফন্ট সাইজ</Label>
                <Select value={widget.data.fontSize} onValueChange={(v) => handleChange("fontSize", v)}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="xs">Extra Small</SelectItem>
                    <SelectItem value="sm">Small</SelectItem>
                    <SelectItem value="base">Normal</SelectItem>
                    <SelectItem value="lg">Large</SelectItem>
                    <SelectItem value="xl">Extra Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>ফন্ট ওয়েট</Label>
                <Select value={widget.data.fontWeight} onValueChange={(v) => handleChange("fontWeight", v)}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="semibold">Semi Bold</SelectItem>
                    <SelectItem value="bold">Bold</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>এলাইনমেন্ট</Label>
                <Select value={widget.data.textAlign} onValueChange={(v) => handleChange("textAlign", v)}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="left">বাম</SelectItem>
                    <SelectItem value="center">মাঝে</SelectItem>
                    <SelectItem value="right">ডান</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case "heading":
        return (
          <div className="space-y-4">
            <div>
              <Label>শিরোনাম</Label>
              <Input
                value={widget.data.text}
                onChange={(e) => handleChange("text", e.target.value)}
                className="mt-1.5"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>হেডিং লেভেল</Label>
                <Select value={widget.data.level} onValueChange={(v) => handleChange("level", v)}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="h1">H1 - সবচেয়ে বড়</SelectItem>
                    <SelectItem value="h2">H2</SelectItem>
                    <SelectItem value="h3">H3</SelectItem>
                    <SelectItem value="h4">H4</SelectItem>
                    <SelectItem value="h5">H5</SelectItem>
                    <SelectItem value="h6">H6 - সবচেয়ে ছোট</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>এলাইনমেন্ট</Label>
                <Select value={widget.data.textAlign} onValueChange={(v) => handleChange("textAlign", v)}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="left">বাম</SelectItem>
                    <SelectItem value="center">মাঝে</SelectItem>
                    <SelectItem value="right">ডান</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case "image":
        return (
          <div className="space-y-4">
            <div>
              <Label>ছবি</Label>
              <div className="mt-1.5">
                {widget.data.src ? (
                  <div className="relative group">
                    <img
                      src={widget.data.src}
                      alt={widget.data.alt}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-7 w-7"
                      onClick={() => handleChange("src", "")}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="h-24 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors"
                  >
                    <Upload className="w-6 h-6 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground mt-1">
                      {isUploading ? "আপলোড হচ্ছে..." : "ছবি আপলোড করুন"}
                    </span>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            </div>
            <div>
              <Label>Alt টেক্সট</Label>
              <Input
                value={widget.data.alt}
                onChange={(e) => handleChange("alt", e.target.value)}
                placeholder="ছবির বিবরণ"
                className="mt-1.5"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>প্রস্থ</Label>
                <Select value={widget.data.width} onValueChange={(v) => handleChange("width", v)}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">Auto</SelectItem>
                    <SelectItem value="full">Full Width</SelectItem>
                    <SelectItem value="half">Half Width</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>কর্নার</Label>
                <Select value={widget.data.rounded} onValueChange={(v) => handleChange("rounded", v)}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="sm">Small</SelectItem>
                    <SelectItem value="lg">Large</SelectItem>
                    <SelectItem value="full">Circle</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case "button":
        return (
          <div className="space-y-4">
            <div>
              <Label>বাটন টেক্সট</Label>
              <Input
                value={widget.data.text}
                onChange={(e) => handleChange("text", e.target.value)}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label>লিংক</Label>
              <Input
                value={widget.data.link}
                onChange={(e) => handleChange("link", e.target.value)}
                placeholder="/courses"
                className="mt-1.5"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>স্টাইল</Label>
                <Select value={widget.data.variant} onValueChange={(v) => handleChange("variant", v)}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="primary">Primary</SelectItem>
                    <SelectItem value="secondary">Secondary</SelectItem>
                    <SelectItem value="outline">Outline</SelectItem>
                    <SelectItem value="ghost">Ghost</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>সাইজ</Label>
                <Select value={widget.data.size} onValueChange={(v) => handleChange("size", v)}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sm">Small</SelectItem>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="lg">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case "spacer":
        return (
          <div>
            <Label>উচ্চতা (px)</Label>
            <Input
              type="number"
              value={widget.data.height}
              onChange={(e) => handleChange("height", e.target.value)}
              min="10"
              max="200"
              className="mt-1.5"
            />
          </div>
        );

      case "divider":
        return (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>স্টাইল</Label>
              <Select value={widget.data.style} onValueChange={(v) => handleChange("style", v)}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="solid">Solid</SelectItem>
                  <SelectItem value="dashed">Dashed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case "video":
        return (
          <div>
            <Label>ভিডিও URL (YouTube/Vimeo)</Label>
            <Input
              value={widget.data.url}
              onChange={(e) => handleChange("url", e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
              className="mt-1.5"
            />
          </div>
        );

      default:
        return <p className="text-sm text-muted-foreground">এই উইজেটের জন্য কোনো এডিটর নেই</p>;
    }
  };

  return (
    <div className="space-y-4">
      {renderEditor()}
      <Button
        variant="destructive"
        size="sm"
        onClick={onDelete}
        className="w-full mt-4"
      >
        <Trash2 className="w-4 h-4 mr-2" />
        উইজেট মুছুন
      </Button>
    </div>
  );
};
