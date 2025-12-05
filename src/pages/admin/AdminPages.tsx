import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Home, 
  Info, 
  Phone, 
  BookOpen, 
  Edit,
  Eye,
  Calendar
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const pages = [
  {
    id: "home",
    title: "হোম পেজ",
    slug: "/",
    icon: Home,
    description: "মূল হোমপেজ - হিরো, ফিচার, কোর্স, টেস্টিমোনিয়াল সেকশন",
    lastModified: "আজ",
    status: "published"
  },
  {
    id: "about",
    title: "আমাদের সম্পর্কে",
    slug: "/about",
    icon: Info,
    description: "প্রতিষ্ঠান সম্পর্কে বিস্তারিত তথ্য",
    lastModified: "গতকাল",
    status: "published"
  },
  {
    id: "courses",
    title: "কোর্স সমূহ",
    slug: "/courses",
    icon: BookOpen,
    description: "সকল কোর্সের তালিকা পেজ",
    lastModified: "২ দিন আগে",
    status: "published"
  },
  {
    id: "contact",
    title: "যোগাযোগ",
    slug: "/contact",
    icon: Phone,
    description: "যোগাযোগ ফর্ম ও তথ্য পেজ",
    lastModified: "৩ দিন আগে",
    status: "published"
  },
];

const AdminPages = () => {
  const navigate = useNavigate();

  const handleEditPage = (pageSlug: string) => {
    navigate(`/admin/page-editor/${pageSlug}`);
  };

  const handleViewPage = (slug: string) => {
    window.open(slug, "_blank");
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">পেজ সমূহ</h1>
            <p className="text-muted-foreground">
              ওয়েবসাইটের সকল পেজ এডিট ও ম্যানেজ করুন
            </p>
          </div>
        </div>

        <div className="grid gap-4">
          {pages.map((page) => {
            const Icon = page.icon;
            return (
              <Card
                key={page.id}
                className="p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>

                  <div className="flex-grow">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg">{page.title}</h3>
                      <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-700">
                        প্রকাশিত
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {page.description}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        {page.slug}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {page.lastModified}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewPage(page.slug)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      দেখুন
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleEditPage(page.id)}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      এডিট করুন
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminPages;
