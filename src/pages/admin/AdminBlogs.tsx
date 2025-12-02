import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useState } from "react";

interface Blog {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  image: string;
  date: string;
}

const initialBlogs: Blog[] = [
  {
    id: 1,
    title: "ওয়েব ডেভেলপমেন্টের ভবিষ্যৎ: ২০২৫ সালে কী শিখবেন?",
    excerpt: "২০২৫ সালে ওয়েব ডেভেলপমেন্টে কোন টেকনোলজি শিখলে ক্যারিয়ার গড়া সহজ হবে...",
    category: "ক্যারিয়ার",
    image: "/src/assets/blog-web-dev-future.jpg",
    date: "১ ডিসেম্বর, ২০২৫",
  },
  {
    id: 2,
    title: "রিমোট জবের জন্য প্রয়োজনীয় স্কিল",
    excerpt: "রিমোট জব পেতে হলে কোন কোন স্কিল থাকা আবশ্যক...",
    category: "রিমোট জব",
    image: "/src/assets/blog-remote-job-skills.jpg",
    date: "২৮ নভেম্বর, ২০২৫",
  },
  {
    id: 3,
    title: "WordPress দিয়ে ই-কমার্স সাইট তৈরি",
    excerpt: "WooCommerce ব্যবহার করে প্রফেশনাল ই-কমার্স সাইট তৈরির গাইড...",
    category: "ওয়ার্ডপ্রেস",
    image: "/src/assets/blog-wordpress-automation.jpg",
    date: "২৫ নভেম্বর, ২০২৫",
  },
];

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState<Blog[]>(initialBlogs);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSave = (blog: Blog) => {
    if (editingBlog) {
      setBlogs(blogs.map((b) => (b.id === blog.id ? blog : b)));
    } else {
      setBlogs([...blogs, { ...blog, id: Date.now() }]);
    }
    setIsDialogOpen(false);
    setEditingBlog(null);
  };

  const handleDelete = (id: number) => {
    setBlogs(blogs.filter((b) => b.id !== id));
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-primary">ব্লগ ম্যানেজমেন্ট</h2>
            <p className="text-muted-foreground">সকল ব্লগ পোস্ট দেখুন, এডিট করুন ও নতুন পোস্ট যোগ করুন</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingBlog(null)}>
                <Plus className="h-4 w-4 mr-2" />
                নতুন ব্লগ
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingBlog ? "ব্লগ এডিট করুন" : "নতুন ব্লগ যোগ করুন"}
                </DialogTitle>
              </DialogHeader>
              <BlogForm
                blog={editingBlog}
                onSave={handleSave}
                onCancel={() => setIsDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <Card key={blog.id} className="overflow-hidden">
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-40 object-cover"
              />
              <div className="p-4 space-y-3">
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                  {blog.category}
                </span>
                <h3 className="font-semibold line-clamp-2">{blog.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {blog.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{blog.date}</span>
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
                      onClick={() => handleDelete(blog.id)}
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
    </AdminLayout>
  );
}

function BlogForm({
  blog,
  onSave,
  onCancel,
}: {
  blog: Blog | null;
  onSave: (blog: Blog) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState<Blog>(
    blog || {
      id: 0,
      title: "",
      excerpt: "",
      category: "",
      image: "",
      date: new Date().toLocaleDateString("bn-BD"),
    }
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
        <Label>সংক্ষেপ</Label>
        <Textarea
          value={formData.excerpt}
          onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
        />
      </div>
      <div>
        <Label>ক্যাটেগরি</Label>
        <Input
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
        />
      </div>
      <div>
        <Label>ছবির URL</Label>
        <Input
          value={formData.image}
          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
        />
      </div>
      <div className="flex gap-2 justify-end">
        <Button variant="outline" onClick={onCancel}>
          বাতিল
        </Button>
        <Button onClick={() => onSave(formData)}>সেভ করুন</Button>
      </div>
    </div>
  );
}
