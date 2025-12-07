import { useState, useMemo } from "react";
import { useAllSiteContent, useUpdateSiteContent, SiteContent } from "@/hooks/useSiteContent";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Search, Save, FileText, Image, Link, List, Globe, Home, User, Phone } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

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

const ContentEditor = ({ content, onSave }: { content: SiteContent; onSave: (value: string | null, jsonValue?: any) => void }) => {
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

const AdminContentEditor = () => {
  const { data: allContent, isLoading } = useAllSiteContent();
  const updateContent = useUpdateSiteContent();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPage, setSelectedPage] = useState("all");

  // Group content by page and section
  const groupedContent = useMemo(() => {
    if (!allContent) return {};

    let filtered = allContent;

    // Filter by search
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.label.toLowerCase().includes(search) ||
          c.content_key.toLowerCase().includes(search) ||
          c.value?.toLowerCase().includes(search)
      );
    }

    // Filter by page
    if (selectedPage !== "all") {
      filtered = filtered.filter((c) => c.page === selectedPage);
    }

    // Group by page then section
    const grouped: Record<string, Record<string, SiteContent[]>> = {};
    filtered.forEach((item) => {
      if (!grouped[item.page]) {
        grouped[item.page] = {};
      }
      if (!grouped[item.page][item.section]) {
        grouped[item.page][item.section] = [];
      }
      grouped[item.page][item.section].push(item);
    });

    return grouped;
  }, [allContent, searchTerm, selectedPage]);

  const handleSave = (id: string) => (value: string | null, jsonValue?: any) => {
    return updateContent.mutateAsync({
      id,
      value: jsonValue ? null : value,
      json_value: jsonValue,
    });
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

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">কন্টেন্ট এডিটর</h1>
          <p className="text-muted-foreground">সাইটের সব টেক্সট, ছবি এবং লিংক এডিট করুন</p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="কন্টেন্ট খুঁজুন..."
              className="pl-10"
            />
          </div>
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
            {Object.keys(groupedContent).length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  কোনো কন্টেন্ট পাওয়া যায়নি
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {Object.entries(groupedContent).map(([page, sections]) => {
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
                        <Accordion type="multiple" className="w-full" defaultValue={Object.keys(sections)}>
                          {Object.entries(sections).map(([section, items]) => (
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
                                      <ContentEditor
                                        content={content}
                                        onSave={handleSave(content.id)}
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
