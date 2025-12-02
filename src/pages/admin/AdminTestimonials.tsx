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
import { Plus, Edit, Trash2, Star } from "lucide-react";
import { useState } from "react";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  content: string;
  image: string;
  rating: number;
}

const initialTestimonials: Testimonial[] = [
  {
    id: 1,
    name: "রাফি আহমেদ",
    role: "ওয়েব ডেভেলপার",
    content: "এই কোর্সটি আমার ক্যারিয়ার বদলে দিয়েছে। এখন আমি ফ্রিল্যান্সিং করে ভালো ইনকাম করছি।",
    image: "/src/assets/testimonial-1.jpg",
    rating: 5,
  },
  {
    id: 2,
    name: "সাবরিনা খান",
    role: "UI/UX ডিজাইনার",
    content: "ফিগমা কোর্সটি অসাধারণ! প্র্যাক্টিক্যাল প্রজেক্ট করতে করতে শেখা হয়ে গেছে।",
    image: "/src/assets/testimonial-2.jpg",
    rating: 5,
  },
  {
    id: 3,
    name: "তানভীর হাসান",
    role: "রিমোট ওয়ার্কার",
    content: "রিমোট জব কোর্স করে এখন আমি একটি US কোম্পানিতে কাজ করছি।",
    image: "/src/assets/testimonial-3.jpg",
    rating: 5,
  },
];

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSave = (testimonial: Testimonial) => {
    if (editingTestimonial) {
      setTestimonials(testimonials.map((t) => (t.id === testimonial.id ? testimonial : t)));
    } else {
      setTestimonials([...testimonials, { ...testimonial, id: Date.now() }]);
    }
    setIsDialogOpen(false);
    setEditingTestimonial(null);
  };

  const handleDelete = (id: number) => {
    setTestimonials(testimonials.filter((t) => t.id !== id));
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-primary">টেস্টিমোনিয়াল ম্যানেজমেন্ট</h2>
            <p className="text-muted-foreground">সকল টেস্টিমোনিয়াল দেখুন, এডিট করুন ও নতুন যোগ করুন</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingTestimonial(null)}>
                <Plus className="h-4 w-4 mr-2" />
                নতুন টেস্টিমোনিয়াল
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingTestimonial ? "টেস্টিমোনিয়াল এডিট করুন" : "নতুন টেস্টিমোনিয়াল যোগ করুন"}
                </DialogTitle>
              </DialogHeader>
              <TestimonialForm
                testimonial={editingTestimonial}
                onSave={handleSave}
                onCancel={() => setIsDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold">{testimonial.name}</h3>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
              <div className="flex gap-1 mb-3">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground mb-4">{testimonial.content}</p>
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    setEditingTestimonial(testimonial);
                    setIsDialogOpen(true);
                  }}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="text-destructive"
                  onClick={() => handleDelete(testimonial.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}

function TestimonialForm({
  testimonial,
  onSave,
  onCancel,
}: {
  testimonial: Testimonial | null;
  onSave: (testimonial: Testimonial) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState<Testimonial>(
    testimonial || {
      id: 0,
      name: "",
      role: "",
      content: "",
      image: "",
      rating: 5,
    }
  );

  return (
    <div className="space-y-4">
      <div>
        <Label>নাম</Label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>
      <div>
        <Label>পদবী/রোল</Label>
        <Input
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
        />
      </div>
      <div>
        <Label>মন্তব্য</Label>
        <Textarea
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
        />
      </div>
      <div>
        <Label>ছবির URL</Label>
        <Input
          value={formData.image}
          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
        />
      </div>
      <div>
        <Label>রেটিং (১-৫)</Label>
        <Input
          type="number"
          min={1}
          max={5}
          value={formData.rating}
          onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) || 5 })}
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
