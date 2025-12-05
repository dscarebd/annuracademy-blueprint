import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Loader2,
  GripVertical,
  Eye,
  EyeOff,
  Upload,
  X,
  Layout,
  Type,
  Star,
  Users,
  BookOpen,
  Megaphone,
  Save,
  ExternalLink,
  Settings,
  ChevronRight,
  Plus,
  Layers,
  Palette,
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
  DragOverlay,
  DragStartEvent,
  useDroppable,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { WidgetPanel } from "@/components/admin/page-editor/WidgetPanel";
import { WidgetRenderer } from "@/components/admin/page-editor/WidgetRenderer";
import { WidgetEditor } from "@/components/admin/page-editor/WidgetEditor";
import { Widget, widgetDefinitions, generateWidgetId } from "@/components/admin/page-editor/WidgetTypes";

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

const pageLabels: Record<string, string> = {
  home: "হোম পেজ",
  about: "আমাদের সম্পর্কে",
  courses: "কোর্স সমূহ",
  contact: "যোগাযোগ",
};

interface SortableSectionItemProps {
  section: PageSection;
  isSelected: boolean;
  onSelect: (section: PageSection) => void;
  onToggleVisibility: (section: PageSection) => void;
}

const SortableSectionItem = ({
  section,
  isSelected,
  onSelect,
  onToggleVisibility,
}: SortableSectionItemProps) => {
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
    <div
      ref={setNodeRef}
      style={style}
      className={`p-3 rounded-lg cursor-pointer transition-all ${
        isSelected
          ? "bg-primary text-primary-foreground"
          : "bg-card hover:bg-muted"
      } ${!section.is_visible ? "opacity-50" : ""}`}
      onClick={() => onSelect(section)}
    >
      <div className="flex items-center gap-3">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1 hover:bg-background/20 rounded"
          onClick={(e) => e.stopPropagation()}
        >
          <GripVertical className="w-4 h-4" />
        </button>

        <div className={`p-2 rounded ${isSelected ? "bg-primary-foreground/20" : "bg-muted"}`}>
          <Icon className={`w-4 h-4 ${isSelected ? "" : "text-primary"}`} />
        </div>

        <div className="flex-grow min-w-0">
          <h4 className="font-medium text-sm truncate">
            {sectionLabels[section.section_type] || section.section_type}
          </h4>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleVisibility(section);
          }}
          className="p-1 hover:bg-background/20 rounded"
        >
          {section.is_visible ? (
            <Eye className="w-4 h-4" />
          ) : (
            <EyeOff className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );
};

interface SortableWidgetProps {
  widget: Widget;
  isSelected: boolean;
  onSelect: () => void;
}

const SortableWidget = ({ widget, isSelected, onSelect }: SortableWidgetProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: widget.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="group relative">
      <div
        {...attributes}
        {...listeners}
        className="absolute -left-8 top-1/2 -translate-y-1/2 p-1 opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing bg-muted rounded transition-opacity"
      >
        <GripVertical className="w-4 h-4 text-muted-foreground" />
      </div>
      <WidgetRenderer widget={widget} isSelected={isSelected} onSelect={onSelect} />
    </div>
  );
};

const WidgetDropZone = ({ onDrop }: { onDrop: () => void }) => {
  const { setNodeRef, isOver } = useDroppable({ id: "widget-drop-zone" });

  return (
    <div
      ref={setNodeRef}
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
        isOver ? "border-primary bg-primary/5" : "border-muted-foreground/30"
      }`}
    >
      <Plus className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
      <p className="text-sm text-muted-foreground">
        বাম পাশ থেকে উইজেট ড্র্যাগ করে এখানে ফেলুন
      </p>
    </div>
  );
};

const AdminPageEditor = () => {
  const { pageSlug = "home" } = useParams();
  const navigate = useNavigate();
  const { data: sections, isLoading } = useAllPageSections(pageSlug);
  const updateSection = useUpdatePageSection();
  const updateOrder = useUpdateSectionOrder();
  const { toast } = useToast();

  const [selectedSection, setSelectedSection] = useState<PageSection | null>(null);
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [selectedWidgetId, setSelectedWidgetId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    image_url: "",
    content: {} as Record<string, any>,
  });
  const [isUploading, setIsUploading] = useState(false);
  const [isReordering, setIsReordering] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [activeTab, setActiveTab] = useState("sections");
  const [draggingWidget, setDraggingWidget] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Auto-select first section
  useEffect(() => {
    if (sections && sections.length > 0 && !selectedSection) {
      selectSection(sections[0]);
    }
  }, [sections]);

  const selectSection = (section: PageSection) => {
    setSelectedSection(section);
    setFormData({
      title: section.title || "",
      subtitle: section.subtitle || "",
      description: section.description || "",
      image_url: section.image_url || "",
      content: section.content || {},
    });
    setWidgets((section.content?.widgets as Widget[]) || []);
    setSelectedWidgetId(null);
    setHasChanges(false);
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
      setHasChanges(true);
      toast({ title: "ছবি আপলোড হয়েছে" });
    } catch (error: any) {
      toast({ title: "ছবি আপলোড ব্যর্থ", description: error.message, variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    if (!selectedSection) return;

    const updatedContent = {
      ...formData.content,
      widgets,
    };

    await updateSection.mutateAsync({
      id: selectedSection.id,
      title: formData.title || null,
      subtitle: formData.subtitle || null,
      description: formData.description || null,
      image_url: formData.image_url || null,
      content: updatedContent,
    });

    setHasChanges(false);
  };

  const toggleVisibility = async (section: PageSection) => {
    await updateSection.mutateAsync({
      id: section.id,
      is_visible: !section.is_visible,
    });
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    if (String(active.id).startsWith("new-widget-")) {
      setDraggingWidget(String(active.id).replace("new-widget-", ""));
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setDraggingWidget(null);

    // Handle new widget drop
    if (String(active.id).startsWith("new-widget-") && over) {
      const widgetType = String(active.id).replace("new-widget-", "");
      const definition = widgetDefinitions.find((w) => w.type === widgetType);
      if (definition) {
        const newWidget: Widget = {
          id: generateWidgetId(),
          type: widgetType,
          data: { ...definition.defaultData },
        };
        setWidgets([...widgets, newWidget]);
        setSelectedWidgetId(newWidget.id);
        setHasChanges(true);
      }
      return;
    }

    // Handle section reordering
    if (!String(active.id).startsWith("widget-") && over && active.id !== over.id && sections) {
      const oldIndex = sections.findIndex((s) => s.id === active.id);
      const newIndex = sections.findIndex((s) => s.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
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
      }
      return;
    }

    // Handle widget reordering
    if (String(active.id).startsWith("widget-") && over && active.id !== over.id) {
      const oldIndex = widgets.findIndex((w) => w.id === active.id);
      const newIndex = widgets.findIndex((w) => w.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        setWidgets(arrayMove(widgets, oldIndex, newIndex));
        setHasChanges(true);
      }
    }
  };

  const handleWidgetChange = (widgetId: string, newData: Record<string, any>) => {
    setWidgets(widgets.map((w) => (w.id === widgetId ? { ...w, data: newData } : w)));
    setHasChanges(true);
  };

  const handleWidgetDelete = (widgetId: string) => {
    setWidgets(widgets.filter((w) => w.id !== widgetId));
    setSelectedWidgetId(null);
    setHasChanges(true);
  };

  const handleFieldChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    setHasChanges(true);
  };

  const handleContentChange = (key: string, value: string) => {
    setFormData({
      ...formData,
      content: { ...formData.content, [key]: value },
    });
    setHasChanges(true);
  };

  const selectedWidget = widgets.find((w) => w.id === selectedWidgetId);

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Top Header */}
      <header className="h-14 bg-background border-b flex items-center justify-between px-4 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("/admin/pages")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            পেজ সমূহ
          </Button>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>পেজ সমূহ</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground font-medium">
              {pageLabels[pageSlug] || pageSlug}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(pageSlug === "home" ? "/" : `/${pageSlug}`, "_blank")}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            প্রিভিউ
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={!hasChanges || updateSection.isPending}
          >
            {updateSection.isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            সংরক্ষণ করুন
          </Button>
        </div>
      </header>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex h-[calc(100vh-56px)]">
          {/* Left Sidebar */}
          <aside className="w-72 bg-background border-r overflow-y-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
              <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
                <TabsTrigger
                  value="sections"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                >
                  <Layers className="w-4 h-4 mr-2" />
                  সেকশন
                </TabsTrigger>
                <TabsTrigger
                  value="widgets"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                >
                  <Palette className="w-4 h-4 mr-2" />
                  উইজেট
                </TabsTrigger>
              </TabsList>

              <TabsContent value="sections" className="flex-1 m-0">
                <div className="p-3 relative">
                  {isReordering && (
                    <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10">
                      <Loader2 className="w-5 h-5 animate-spin text-primary" />
                    </div>
                  )}

                  {isLoading ? (
                    <div className="flex items-center justify-center p-8">
                      <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    </div>
                  ) : sections && sections.length > 0 ? (
                    <SortableContext
                      items={sections.map((s) => s.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="space-y-2">
                        {sections.map((section) => (
                          <SortableSectionItem
                            key={section.id}
                            section={section}
                            isSelected={selectedSection?.id === section.id}
                            onSelect={selectSection}
                            onToggleVisibility={toggleVisibility}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  ) : (
                    <div className="text-center p-8 text-muted-foreground">
                      <Layout className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">কোনো সেকশন নেই</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="widgets" className="flex-1 m-0 overflow-y-auto">
                <WidgetPanel />
              </TabsContent>
            </Tabs>
          </aside>

          {/* Main Editor Area */}
          <main className="flex-grow overflow-y-auto">
            {selectedSection ? (
              <div className="p-6">
                <Card className="max-w-4xl mx-auto">
                  {/* Section Header */}
                  <div className="p-4 border-b flex items-center gap-3">
                    {(() => {
                      const Icon = sectionIcons[selectedSection.section_type] || Layout;
                      return (
                        <div className="p-2 rounded-lg bg-primary/10">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                      );
                    })()}
                    <div>
                      <h2 className="font-semibold">
                        {sectionLabels[selectedSection.section_type] || selectedSection.section_type}
                      </h2>
                      <p className="text-xs text-muted-foreground">
                        কনটেন্ট ও উইজেট এডিট করুন
                      </p>
                    </div>
                  </div>

                  {/* Section Content */}
                  <div className="p-6 space-y-6">
                    {/* Basic Fields */}
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Label htmlFor="title" className="text-sm font-medium">
                          শিরোনাম
                        </Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) => handleFieldChange("title", e.target.value)}
                          placeholder="সেকশনের শিরোনাম"
                          className="mt-1.5"
                        />
                      </div>
                      <div>
                        <Label htmlFor="subtitle" className="text-sm font-medium">
                          সাবটাইটেল
                        </Label>
                        <Input
                          id="subtitle"
                          value={formData.subtitle}
                          onChange={(e) => handleFieldChange("subtitle", e.target.value)}
                          placeholder="সেকশনের সাবটাইটেল"
                          className="mt-1.5"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="description" className="text-sm font-medium">
                        বিবরণ
                      </Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => handleFieldChange("description", e.target.value)}
                        placeholder="সেকশনের বিবরণ"
                        rows={3}
                        className="mt-1.5"
                      />
                    </div>

                    {/* Hero/CTA Button Settings */}
                    {(selectedSection.section_type === "hero" ||
                      selectedSection.section_type === "cta") && (
                      <div className="border-t pt-4">
                        <h3 className="font-medium mb-3 flex items-center gap-2">
                          <Settings className="w-4 h-4" />
                          বাটন সেটিংস
                        </h3>
                        <div className="grid gap-4 md:grid-cols-2">
                          <div>
                            <Label className="text-sm">বাটন টেক্সট</Label>
                            <Input
                              value={formData.content.button_text || ""}
                              onChange={(e) => handleContentChange("button_text", e.target.value)}
                              placeholder="কোর্স দেখুন"
                              className="mt-1.5"
                            />
                          </div>
                          <div>
                            <Label className="text-sm">বাটন লিংক</Label>
                            <Input
                              value={formData.content.button_link || ""}
                              onChange={(e) => handleContentChange("button_link", e.target.value)}
                              placeholder="/courses"
                              className="mt-1.5"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Widgets Area */}
                    <div className="border-t pt-4">
                      <h3 className="font-medium mb-3 flex items-center gap-2">
                        <Palette className="w-4 h-4" />
                        কাস্টম উইজেট
                      </h3>

                      {widgets.length > 0 ? (
                        <SortableContext
                          items={widgets.map((w) => w.id)}
                          strategy={verticalListSortingStrategy}
                        >
                          <div className="space-y-4 pl-8">
                            {widgets.map((widget) => (
                              <SortableWidget
                                key={widget.id}
                                widget={widget}
                                isSelected={selectedWidgetId === widget.id}
                                onSelect={() => setSelectedWidgetId(widget.id)}
                              />
                            ))}
                          </div>
                        </SortableContext>
                      ) : null}

                      <div className="mt-4">
                        <WidgetDropZone onDrop={() => {}} />
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <div className="text-center">
                  <Layout className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>বাম পাশ থেকে একটি সেকশন সিলেক্ট করুন</p>
                </div>
              </div>
            )}
          </main>

          {/* Right Sidebar - Widget Editor */}
          {selectedWidget && (
            <aside className="w-80 bg-background border-l overflow-y-auto">
              <div className="p-4 border-b">
                <h3 className="font-semibold">উইজেট সেটিংস</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {widgetDefinitions.find((w) => w.type === selectedWidget.type)?.label}
                </p>
              </div>
              <div className="p-4">
                <WidgetEditor
                  widget={selectedWidget}
                  onChange={(data) => handleWidgetChange(selectedWidget.id, data)}
                  onDelete={() => handleWidgetDelete(selectedWidget.id)}
                />
              </div>
            </aside>
          )}
        </div>

        <DragOverlay>
          {draggingWidget && (
            <div className="p-3 rounded-lg border bg-card shadow-lg">
              <span className="text-sm font-medium">
                {widgetDefinitions.find((w) => w.type === draggingWidget)?.label}
              </span>
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default AdminPageEditor;
