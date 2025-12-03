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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Edit, Trash2, Loader2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import {
  useAdminBlogs,
  useCreateBlog,
  useUpdateBlog,
  useDeleteBlog,
  Blog,
  BlogInsert,
} from "@/hooks/useBlogs";

interface BlogFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  category_color: string;
  image_url: string;
  author: string;
  link: string;
  is_published: boolean;
  published_at: string;
}

const emptyFormData: BlogFormData = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  category: "",
  category_color: "bg-blue-500",
  image_url: "",
  author: "An-Nur Academy",
  link: "",
  is_published: true,
  published_at: format(new Date(), "yyyy-MM-dd"),
};

export default function AdminBlogs() {
  const { data: blogs, isLoading, error } = useAdminBlogs();
  const createBlog = useCreateBlog();
  const updateBlog = useUpdateBlog();
  const deleteBlog = useDeleteBlog();
  const { toast } = useToast();

  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleSave = async (formData: BlogFormData) => {
    try {
      if (editingBlog) {
        await updateBlog.mutateAsync({
          id: editingBlog.id,
          ...formData,
        });
        toast({
          title: "সফল!",
          description: "ব্লগ আপডেট করা হয়েছে",
        });
      } else {
        await createBlog.mutateAsync(formData as BlogInsert);
        toast({
          title: "সফল!",
          description: "নতুন ব্লগ যোগ করা হয়েছে",
        });
      }
      setIsDialogOpen(false);
      setEditingBlog(null);
    } catch (err) {
      toast({
        title: "ত্রুটি!",
        description: "ব্লগ সেভ করতে সমস্যা হয়েছে",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteBlog.mutateAsync(deleteId);
      toast({
        title: "সফল!",
        description: "ব্লগ ডিলিট করা হয়েছে",
      });
    } catch (err) {
      toast({
        title: "ত্রুটি!",
        description: "ব্লগ ডিলিট করতে সমস্যা হয়েছে",
        variant: "destructive",
      });
    }
    setDeleteId(null);
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="text-center py-12 text-destructive">
          ব্লগ লোড করতে সমস্যা হয়েছে
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-primary">ব্লগ ম্যানেজমেন্ট</h2>
            <p className="text-muted-foreground">
              সকল ব্লগ পোস্ট দেখুন, এডিট করুন ও নতুন পোস্ট যোগ করুন
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingBlog(null)}>
                <Plus className="h-4 w-4 mr-2" />
                নতুন ব্লগ
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingBlog ? "ব্লগ এডিট করুন" : "নতুন ব্লগ যোগ করুন"}
                </DialogTitle>
              </DialogHeader>
              <BlogForm
                blog={editingBlog}
                onSave={handleSave}
                onCancel={() => setIsDialogOpen(false)}
                isLoading={createBlog.isPending || updateBlog.isPending}
              />
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs?.map((blog) => (
            <Card key={blog.id} className="overflow-hidden">
              <img
                src={blog.image_url || ''}
                alt={blog.title}
                className="w-full h-40 object-cover"
              />
              <div className="p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <span className={`text-xs text-white px-2 py-1 rounded ${blog.category_color || 'bg-blue-500'}`}>
                    {blog.category}
                  </span>
                  {!blog.is_published && (
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                      Draft
                    </span>
                  )}
                </div>
                <h3 className="font-semibold line-clamp-2">{blog.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {blog.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {blog.published_at 
                      ? format(new Date(blog.published_at), "dd/MM/yyyy")
                      : ""}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        setEditingBlog(blog);
                        setIsDialogOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="text-destructive"
                      onClick={() => setDeleteId(blog.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>ব্লগ ডিলিট করতে চান?</AlertDialogTitle>
            <AlertDialogDescription>
              এই কাজটি ফিরিয়ে নেওয়া যাবে না। ব্লগটি স্থায়ীভাবে মুছে যাবে।
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>বাতিল</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground"
            >
              {deleteBlog.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "ডিলিট করুন"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}

function BlogForm({
  blog,
  onSave,
  onCancel,
  isLoading,
}: {
  blog: Blog | null;
  onSave: (data: BlogFormData) => void;
  onCancel: () => void;
  isLoading: boolean;
}) {
  const [formData, setFormData] = useState<BlogFormData>(
    blog
      ? {
          title: blog.title,
          slug: blog.slug || "",
          excerpt: blog.excerpt || "",
          content: blog.content || "",
          category: blog.category,
          category_color: blog.category_color || "bg-blue-500",
          image_url: blog.image_url || "",
          author: blog.author,
          link: blog.link || "",
          is_published: blog.is_published ?? true,
          published_at: blog.published_at || format(new Date(), "yyyy-MM-dd"),
        }
      : emptyFormData
  );

  return (
    <div className="space-y-4">
      <div>
        <Label>শিরোনাম</Label>
        <Input
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
      </div>
      <div>
        <Label>স্লাগ (URL)</Label>
        <Input
          value={formData.slug}
          placeholder="auto-generated-if-empty"
          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
        />
        <p className="text-xs text-muted-foreground mt-1">
          খালি রাখলে টাইটেল থেকে অটো জেনারেট হবে
        </p>
      </div>
      <div>
        <Label>সংক্ষেপ</Label>
        <Textarea
          value={formData.excerpt}
          onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
          rows={2}
        />
      </div>
      <div>
        <Label>পূর্ণ কন্টেন্ট</Label>
        <Textarea
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          rows={8}
          placeholder="ব্লগের পূর্ণ কন্টেন্ট এখানে লিখুন..."
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>ক্যাটেগরি</Label>
          <Input
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          />
        </div>
        <div>
          <Label>ক্যাটেগরি কালার</Label>
          <Input
            value={formData.category_color}
            placeholder="bg-blue-500"
            onChange={(e) => setFormData({ ...formData, category_color: e.target.value })}
          />
        </div>
      </div>
      <div>
        <Label>ছবির URL</Label>
        <Input
          value={formData.image_url}
          onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>লেখক</Label>
          <Input
            value={formData.author}
            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
          />
        </div>
        <div>
          <Label>তারিখ</Label>
          <Input
            type="date"
            value={formData.published_at}
            onChange={(e) => setFormData({ ...formData, published_at: e.target.value })}
          />
        </div>
      </div>
      <div>
        <Label>লিংক (ঐচ্ছিক)</Label>
        <Input
          value={formData.link}
          onChange={(e) => setFormData({ ...formData, link: e.target.value })}
        />
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="is_published"
          checked={formData.is_published}
          onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })}
        />
        <Label htmlFor="is_published">পাবলিশড</Label>
      </div>
      <div className="flex gap-2 justify-end">
        <Button variant="outline" onClick={onCancel} disabled={isLoading}>
          বাতিল
        </Button>
        <Button onClick={() => onSave(formData)} disabled={isLoading}>
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          সেভ করুন
        </Button>
      </div>
    </div>
  );
}
