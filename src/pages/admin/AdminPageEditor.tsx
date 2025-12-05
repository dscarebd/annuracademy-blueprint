import { useState, useRef } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Pencil,
  Loader2,
  GripVertical,
  Eye,
  EyeOff,
  Upload,
  X,
  Layout,
  Type,
  Image as ImageIcon,
  Star,
  Users,
  BookOpen,
  Megaphone,
} from "lucide-react";
import {
  useAllPageSections,
  useUpdatePageSection,
  useUpdateSectionOrder,
  PageSection,
} from "@/hooks/usePageSections";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const sectionIcons: Record<string, any> = {
  hero: Megaphone,
  features: Star,
  courses: BookOpen,
  testimonials: Users,
  about: Type,
  cta: Layout,
};

const sectionLabels: Record<string, string> = {
  hero: "হিরো সেকশন",
  features: "ফিচার সেকশন",
  courses: "কোর্স সেকশন",
  testimonials: "টেস্টিমোনিয়াল সেকশন",
  about: "অ্যাবাউট সেকশন",
  cta: "কল টু অ্যাকশন",
};

interface SortableSectionCardProps {
  section: PageSection;
  onEdit: (section: PageSection) => void;
  onToggleVisibility: (section: PageSection) => void;
}

const SortableSectionCard = ({ section, onEdit, onToggleVisibility }: SortableSectionCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const Icon = sectionIcons[section.section_type] || Layout;

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`p-4 ${!section.is_visible ? "opacity-50" : ""}`}
    >
      <div className="flex items-center gap-4">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-2 hover:bg-muted rounded"
        >
          <GripVertical className="w-5 h-5 text-muted-foreground" />
        </button>

        <div className={`p-2 rounded-lg ${section.is_visible ? "bg-primary/10" : "bg-muted"}`}>
          <Icon className={`w-5 h-5 ${section.is_visible ? "text-primary" : "text-muted-foreground"}`} />
        </div>

        <div className="flex-grow">
          <h3 className="font-medium">
            {sectionLabels[section.section_type] || section.section_type}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-1">
            {section.title || "শিরোনাম নেই"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onToggleVisibility(section)}
            title={section.is_visible ? "লুকান" : "দেখান"}
          >
            {section.is_visible ? (
              <Eye className="w-4 h-4" />
            ) : (
              <EyeOff className="w-4 h-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(section)}
          >
            <Pencil className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

const AdminPageEditor = () => {
  const { data: sections, isLoading } = useAllPageSections("home");
  const updateSection = useUpdatePageSection();
  const updateOrder = useUpdateSectionOrder();
  const { toast } = useToast();

  const [editingSection, setEditingSection] = useState<PageSection | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    image_url: "",
    content: {} as Record<string, any>,
  });
  const [isUploading, setIsUploading] = useState(false);
  const [isReordering, setIsReordering] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const openEditDialog = (section: PageSection) => {
    setEditingSection(section);
    setFormData({
      title: section.title || "",
      subtitle: section.subtitle || "",
      description: section.description || "",
      image_url: section.image_url || "",
      content: section.content || {},
    });
    setIsDialogOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({ title: "শুধুমাত্র ইমেজ ফাইল আপলোড করুন", variant: "destructive" });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "ফাইল সাইজ ৫MB এর বেশি হতে পারবে না", variant: "destructive" });
      return;
    }

    setIsUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `section-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(fileName);

      setFormData({ ...formData, image_url: publicUrl });
      toast({ title: "ছবি আপলোড হয়েছে" });
    } catch (error: any) {
      toast({ title: "ছবি আপলোড ব্যর্থ", description: error.message, variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSection) return;

    await updateSection.mutateAsync({
      id: editingSection.id,
      title: formData.title || null,
      subtitle: formData.subtitle || null,
      description: formData.description || null,
      image_url: formData.image_url || null,
      content: formData.content,
    });

    setIsDialogOpen(false);
    setEditingSection(null);
  };

  const toggleVisibility = async (section: PageSection) => {
    await updateSection.mutateAsync({
      id: section.id,
      is_visible: !section.is_visible,
    });
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id || !sections) return;

    const oldIndex = sections.findIndex((s) => s.id === active.id);
    const newIndex = sections.findIndex((s) => s.id === over.id);

    const reorderedSections = arrayMove(sections, oldIndex, newIndex);

    setIsReordering(true);
    try {
      await updateOrder.mutateAsync(
        reorderedSections.map((section, index) => ({
          id: section.id,
          sort_order: index,
        }))
      );
    } finally {
      setIsReordering(false);
    }
  };

  const handleContentChange = (key: string, value: string) => {
    setFormData({
      ...formData,
      content: { ...formData.content, [key]: value },
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">পেজ এডিটর</h1>
          <p className="text-muted-foreground">
            হোমপেজের সেকশনগুলো ড্র্যাগ করে রিঅর্ডার করুন এবং এডিট করুন
          </p>
        </div>

        <Card className="p-4 bg-muted/50">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Layout className="w-4 h-4" />
            <span>টিপস: সেকশনগুলো ড্র্যাগ করে ক্রম পরিবর্তন করুন। চোখের আইকনে ক্লিক করে লুকান/দেখান।</span>
          </div>
        </Card>

        <div className="relative">
          {isReordering && (
            <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10 rounded-lg">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          )}

          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : sections && sections.length > 0 ? (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={sections.map((s) => s.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-3">
                  {sections.map((section) => (
                    <SortableSectionCard
                      key={section.id}
                      section={section}
                      onEdit={openEditDialog}
                      onToggleVisibility={toggleVisibility}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          ) : (
            <Card className="p-8 text-center">
              <Layout className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium">কোনো সেকশন নেই</h3>
            </Card>
          )}
        </div>

        {/* Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingSection && (sectionLabels[editingSection.section_type] || "সেকশন")} এডিট করুন
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">শিরোনাম</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="সেকশনের শিরোনাম"
                />
              </div>

              <div>
                <Label htmlFor="subtitle">সাবটাইটেল</Label>
                <Input
                  id="subtitle"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="সেকশনের সাবটাইটেল"
                />
              </div>

              <div>
                <Label htmlFor="description">বিবরণ</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="সেকশনের বিবরণ"
                  rows={3}
                />
              </div>

              {/* Image Upload */}
              <div>
                <Label>ছবি (ঐচ্ছিক)</Label>
                <div className="mt-2">
                  {formData.image_url ? (
                    <div className="relative inline-block">
                      <img
                        src={formData.image_url}
                        alt="Section"
                        className="w-full max-w-xs h-32 object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, image_url: "" })}
                        className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full h-24 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors"
                    >
                      {isUploading ? (
                        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                      ) : (
                        <>
                          <Upload className="w-6 h-6 text-muted-foreground mb-1" />
                          <span className="text-sm text-muted-foreground">ছবি আপলোড করুন</span>
                        </>
                      )}
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

              {/* Dynamic Content Fields based on section type */}
              {editingSection?.section_type === "hero" && (
                <>
                  <div>
                    <Label>বাটন টেক্সট</Label>
                    <Input
                      value={formData.content.button_text || ""}
                      onChange={(e) => handleContentChange("button_text", e.target.value)}
                      placeholder="কোর্স দেখুন"
                    />
                  </div>
                  <div>
                    <Label>বাটন লিংক</Label>
                    <Input
                      value={formData.content.button_link || ""}
                      onChange={(e) => handleContentChange("button_link", e.target.value)}
                      placeholder="/courses"
                    />
                  </div>
                </>
              )}

              {editingSection?.section_type === "cta" && (
                <>
                  <div>
                    <Label>বাটন টেক্সট</Label>
                    <Input
                      value={formData.content.button_text || ""}
                      onChange={(e) => handleContentChange("button_text", e.target.value)}
                      placeholder="এখনই রেজিস্টার করুন"
                    />
                  </div>
                  <div>
                    <Label>বাটন লিংক</Label>
                    <Input
                      value={formData.content.button_link || ""}
                      onChange={(e) => handleContentChange("button_link", e.target.value)}
                      placeholder="/courses"
                    />
                  </div>
                </>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={updateSection.isPending}
              >
                {updateSection.isPending && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                সংরক্ষণ করুন
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminPageEditor;
