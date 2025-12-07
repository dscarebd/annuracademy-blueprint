import { useState, useMemo } from "react";
import { useAllSiteContent, useUpdateSiteContent, SiteContent } from "@/hooks/useSiteContent";
import { useAllPageSections, useUpdatePageSection, PageSection } from "@/hooks/usePageSections";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Search, Save, FileText, Image, Link, List, Globe, Home, User, Phone, Layout, Eye, EyeOff } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

const PAGE_CONFIG = {
  global: { label: "গ্লোবাল", icon: Globe, color: "bg-blue-500" },
  home: { label: "হোম পেজ", icon: Home, color: "bg-green-500" },
  about: { label: "সম্পর্কে পেজ", icon: User, color: "bg-purple-500" },
  contact: { label: "যোগাযোগ পেজ", icon: Phone, color: "bg-orange-500" },
};

const SECTION_LABELS: Record<string, string> = {
  header: "হেডার",
  footer: "ফুটার",
  hero: "হিরো সেকশন",
  why_section: "কেন সেকশন",
  features_section: "ফিচার সেকশন",
  about_instructor: "প্রশিক্ষক সেকশন",
  founder: "ফাউন্ডার সেকশন",
  why_us: "কেন আমরা সেকশন",
  guidelines: "গাইডলাইন",
  contact_info: "যোগাযোগ তথ্য",
  faq: "FAQ",
  features: "ফিচার সেকশন",
  courses: "কোর্স সেকশন",
  testimonials: "টেস্টিমোনিয়াল সেকশন",
  about: "অ্যাবাউট সেকশন",
  cta: "কল টু অ্যাকশন",
};

const ContentTypeIcon = ({ type }: { type: string }) => {
  switch (type) {
    case "text":
      return <FileText className="w-4 h-4" />;
    case "textarea":
      return <FileText className="w-4 h-4" />;
    case "image":
      return <Image className="w-4 h-4" />;
    case "link":
      return <Link className="w-4 h-4" />;
    case "json":
      return <List className="w-4 h-4" />;
    default:
      return <FileText className="w-4 h-4" />;
  }
};

// Editor for site_content items
const SiteContentEditor = ({ content, onSave }: { content: SiteContent; onSave: (value: string | null, jsonValue?: any) => void }) => {
  const [value, setValue] = useState(content.value || "");
  const [jsonValue, setJsonValue] = useState(
    content.json_value ? JSON.stringify(content.json_value, null, 2) : ""
  );
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (content.content_type === "json") {
        const parsed = JSON.parse(jsonValue);
        await onSave(null, parsed);
      } else {
        await onSave(value);
      }
    } catch (error) {
      console.error("Save error:", error);
      toast.error("সংরক্ষণ করা যায়নি");
    } finally {
      setIsSaving(false);
    }
  };

  const hasChanges = content.content_type === "json"
    ? jsonValue !== JSON.stringify(content.json_value, null, 2)
    : value !== (content.value || "");

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <ContentTypeIcon type={content.content_type} />
        <span className="font-medium text-sm">{content.label}</span>
        <Badge variant="outline" className="text-xs">
          {content.content_type}
        </Badge>
      </div>

      {content.content_type === "text" && (
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={content.label}
          className="w-full"
        />
      )}

      {content.content_type === "textarea" && (
        <Textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={content.label}
          rows={4}
          className="w-full"
        />
      )}

      {content.content_type === "image" && (
        <div className="space-y-2">
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Image URL"
            className="w-full"
          />
          {value && (
            <div className="w-32 h-32 border rounded-lg overflow-hidden bg-muted">
              <img
                src={value}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/placeholder.svg";
                }}
              />
            </div>
          )}
        </div>
      )}

      {content.content_type === "link" && (
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="URL"
          type="url"
          className="w-full"
        />
      )}

      {content.content_type === "json" && (
        <Textarea
          value={jsonValue}
          onChange={(e) => setJsonValue(e.target.value)}
          placeholder="JSON data"
          rows={8}
          className="w-full font-mono text-xs"
        />
      )}

      {hasChanges && (
        <Button onClick={handleSave} disabled={isSaving} size="sm" className="gap-2">
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          সংরক্ষণ করুন
        </Button>
      )}
    </div>
  );
};

// Editor for page_sections items  
const PageSectionEditor = ({ section, onSave }: { section: PageSection; onSave: (data: Partial<PageSection>) => Promise<void> }) => {
  const [formData, setFormData] = useState({
    title: section.title || "",
    subtitle: section.subtitle || "",
    description: section.description || "",
    image_url: section.image_url || "",
    is_visible: section.is_visible ?? true,
    content: section.content || {},
  });
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleContentChange = (key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      content: { ...prev.content, [key]: value }
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave({
        title: formData.title || null,
        subtitle: formData.subtitle || null,
        description: formData.description || null,
        image_url: formData.image_url || null,
        is_visible: formData.is_visible,
        content: formData.content,
      });
      setHasChanges(false);
      toast.success("সংরক্ষিত হয়েছে!");
    } catch (error) {
      toast.error("সংরক্ষণ করা যায়নি");
    } finally {
      setIsSaving(false);
    }
  };

  const contentFields = formData.content as Record<string, any>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layout className="w-4 h-4" />
          <span className="font-medium text-sm">{SECTION_LABELS[section.section_type] || section.section_type}</span>
          <Badge variant="secondary" className="text-xs">Page Section</Badge>
        </div>
        <div className="flex items-center gap-2">
          {formData.is_visible ? <Eye className="w-4 h-4 text-green-600" /> : <EyeOff className="w-4 h-4 text-muted-foreground" />}
          <Switch
            checked={formData.is_visible}
            onCheckedChange={(checked) => handleChange("is_visible", checked)}
          />
          <span className="text-xs text-muted-foreground">দৃশ্যমান</span>
        </div>
      </div>

      <div className="grid gap-4">
        <div>
          <label className="text-sm font-medium mb-1 block">টাইটেল</label>
          <Input
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            placeholder="সেকশন টাইটেল"
          />
        </div>

        {section.section_type === "hero" && (
          <>
            <div>
              <label className="text-sm font-medium mb-1 block">সাবটাইটেল</label>
              <Input
                value={formData.subtitle}
                onChange={(e) => handleChange("subtitle", e.target.value)}
                placeholder="সাবটাইটেল"
              />
            </div>
          </>
        )}

        <div>
          <label className="text-sm font-medium mb-1 block">বর্ণনা</label>
          <Textarea
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="সেকশন বর্ণনা"
            rows={3}
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">ছবি URL</label>
          <Input
            value={formData.image_url}
            onChange={(e) => handleChange("image_url", e.target.value)}
            placeholder="https://..."
          />
          {formData.image_url && (
            <div className="mt-2 w-32 h-32 border rounded-lg overflow-hidden bg-muted">
              <img
                src={formData.image_url}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/placeholder.svg";
                }}
              />
            </div>
          )}
        </div>

        {/* Content fields like button_text, button_link */}
        {contentFields.button_text !== undefined && (
          <div>
            <label className="text-sm font-medium mb-1 block">বাটন টেক্সট</label>
            <Input
              value={contentFields.button_text || ""}
              onChange={(e) => handleContentChange("button_text", e.target.value)}
              placeholder="বাটন টেক্সট"
            />
          </div>
        )}

        {contentFields.button_link !== undefined && (
          <div>
            <label className="text-sm font-medium mb-1 block">বাটন লিংক</label>
            <Input
              value={contentFields.button_link || ""}
              onChange={(e) => handleContentChange("button_link", e.target.value)}
              placeholder="/courses"
            />
          </div>
        )}
      </div>

      {hasChanges && (
        <Button onClick={handleSave} disabled={isSaving} size="sm" className="gap-2">
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          সংরক্ষণ করুন
        </Button>
      )}
    </div>
  );
};

const AdminContentEditor = () => {
  const { data: siteContent, isLoading: siteLoading } = useAllSiteContent();
  const { data: homeSections, isLoading: homeLoading } = useAllPageSections("home");
  const updateSiteContent = useUpdateSiteContent();
  const updatePageSection = useUpdatePageSection();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPage, setSelectedPage] = useState("all");

  const isLoading = siteLoading || homeLoading;

  // Combine and group all content
  const groupedContent = useMemo(() => {
    const result: Record<string, { siteContent: Record<string, SiteContent[]>; pageSections: PageSection[] }> = {
      global: { siteContent: {}, pageSections: [] },
      home: { siteContent: {}, pageSections: [] },
      about: { siteContent: {}, pageSections: [] },
      contact: { siteContent: {}, pageSections: [] },
    };

    // Group site_content by page and section
    siteContent?.forEach((item) => {
      const page = item.page;
      if (!result[page]) {
        result[page] = { siteContent: {}, pageSections: [] };
      }
      if (!result[page].siteContent[item.section]) {
        result[page].siteContent[item.section] = [];
      }
      
      // Apply search filter
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        if (
          !item.label.toLowerCase().includes(search) &&
          !item.content_key.toLowerCase().includes(search) &&
          !item.value?.toLowerCase().includes(search)
        ) {
          return;
        }
      }
      
      result[page].siteContent[item.section].push(item);
    });

    // Add page sections to home
    homeSections?.forEach((section) => {
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        if (
          !section.title?.toLowerCase().includes(search) &&
          !section.section_type.toLowerCase().includes(search) &&
          !section.description?.toLowerCase().includes(search)
        ) {
          return;
        }
      }
      result.home.pageSections.push(section);
    });

    // Filter by selected page
    if (selectedPage !== "all") {
      const filtered: typeof result = {};
      if (result[selectedPage]) {
        filtered[selectedPage] = result[selectedPage];
      }
      return filtered;
    }

    return result;
  }, [siteContent, homeSections, searchTerm, selectedPage]);

  const handleSaveSiteContent = (id: string) => (value: string | null, jsonValue?: any) => {
    return updateSiteContent.mutateAsync({
      id,
      value: jsonValue ? null : value,
      json_value: jsonValue,
    });
  };

  const handleSavePageSection = (id: string) => async (data: Partial<PageSection>) => {
    await updatePageSection.mutateAsync({ id, ...data });
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  const hasContent = (pageData: typeof groupedContent[string]) => {
    return Object.keys(pageData.siteContent).length > 0 || pageData.pageSections.length > 0;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">কন্টেন্ট এডিটর</h1>
          <p className="text-muted-foreground">সাইটের সব টেক্সট, ছবি, বাটন এবং সেকশন এডিট করুন</p>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="কন্টেন্ট খুঁজুন..."
            className="pl-10"
          />
        </div>

        {/* Page Tabs */}
        <Tabs value={selectedPage} onValueChange={setSelectedPage}>
          <TabsList className="flex-wrap h-auto gap-1 p-1">
            <TabsTrigger value="all" className="gap-2">
              সব পেজ
            </TabsTrigger>
            {Object.entries(PAGE_CONFIG).map(([key, config]) => {
              const Icon = config.icon;
              return (
                <TabsTrigger key={key} value={key} className="gap-2">
                  <Icon className="w-4 h-4" />
                  {config.label}
                </TabsTrigger>
              );
            })}
          </TabsList>

          <TabsContent value={selectedPage} className="mt-6">
            {Object.entries(groupedContent).filter(([_, data]) => hasContent(data)).length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  কোনো কন্টেন্ট পাওয়া যায়নি
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {Object.entries(groupedContent).map(([page, pageData]) => {
                  if (!hasContent(pageData)) return null;
                  
                  const pageConfig = PAGE_CONFIG[page as keyof typeof PAGE_CONFIG];
                  
                  return (
                    <Card key={page}>
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-lg">
                          {pageConfig && (
                            <>
                              <div className={`w-3 h-3 rounded-full ${pageConfig.color}`} />
                              {pageConfig.label}
                            </>
                          )}
                          {!pageConfig && page}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Accordion type="multiple" className="w-full" defaultValue={[...Object.keys(pageData.siteContent), "page_sections"]}>
                          
                          {/* Page Sections (for home page) */}
                          {pageData.pageSections.length > 0 && (
                            <AccordionItem value="page_sections">
                              <AccordionTrigger className="hover:no-underline">
                                <span className="flex items-center gap-2">
                                  <Layout className="w-4 h-4" />
                                  পেজ সেকশন (Hero, CTA ইত্যাদি)
                                  <Badge variant="secondary" className="text-xs">
                                    {pageData.pageSections.length}
                                  </Badge>
                                </span>
                              </AccordionTrigger>
                              <AccordionContent>
                                <div className="space-y-6 pt-4">
                                  {pageData.pageSections.map((section) => (
                                    <div key={section.id} className="border-b pb-6 last:border-0 last:pb-0">
                                      <PageSectionEditor
                                        section={section}
                                        onSave={handleSavePageSection(section.id)}
                                      />
                                    </div>
                                  ))}
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          )}

                          {/* Site Content sections */}
                          {Object.entries(pageData.siteContent).map(([section, items]) => (
                            <AccordionItem key={section} value={section}>
                              <AccordionTrigger className="hover:no-underline">
                                <span className="flex items-center gap-2">
                                  {SECTION_LABELS[section] || section}
                                  <Badge variant="secondary" className="text-xs">
                                    {items.length}
                                  </Badge>
                                </span>
                              </AccordionTrigger>
                              <AccordionContent>
                                <div className="space-y-6 pt-4">
                                  {items.map((content) => (
                                    <div key={content.id} className="border-b pb-4 last:border-0 last:pb-0">
                                      <SiteContentEditor
                                        content={content}
                                        onSave={handleSaveSiteContent(content.id)}
                                      />
                                    </div>
                                  ))}
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminContentEditor;
