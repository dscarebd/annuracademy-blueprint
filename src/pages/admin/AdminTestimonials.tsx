import { AdminLayout } from "@/components/admin/AdminLayout";
import { ImageUpload } from "@/components/admin/ImageUpload";
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
import { Plus, Edit, Trash2, Star, Loader2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  useAdminTestimonials,
  useCreateTestimonial,
  useUpdateTestimonial,
  useDeleteTestimonial,
  Testimonial,
  TestimonialInsert,
} from "@/hooks/useTestimonials";

interface TestimonialFormData {
  name: string;
  course: string;
  content: string;
  image_url: string;
  rating: number;
  is_published: boolean;
}

const emptyFormData: TestimonialFormData = {
  name: "",
  course: "",
  content: "",
  image_url: "",
  rating: 5,
  is_published: true,
};

export default function AdminTestimonials() {
  const { data: testimonials, isLoading, error } = useAdminTestimonials();
  const createTestimonial = useCreateTestimonial();
  const updateTestimonial = useUpdateTestimonial();
  const deleteTestimonial = useDeleteTestimonial();
  const { toast } = useToast();

  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleSave = async (formData: TestimonialFormData) => {
    try {
      if (editingTestimonial) {
        await updateTestimonial.mutateAsync({
          id: editingTestimonial.id,
          ...formData,
        });
        toast({
          title: "সফল!",
          description: "টেস্টিমোনিয়াল আপডেট করা হয়েছে",
        });
      } else {
        await createTestimonial.mutateAsync(formData as TestimonialInsert);
        toast({
          title: "সফল!",
          description: "নতুন টেস্টিমোনিয়াল যোগ করা হয়েছে",
        });
      }
      setIsDialogOpen(false);
      setEditingTestimonial(null);
    } catch (err) {
      toast({
        title: "ত্রুটি!",
        description: "টেস্টিমোনিয়াল সেভ করতে সমস্যা হয়েছে",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteTestimonial.mutateAsync(deleteId);
      toast({
        title: "সফল!",
        description: "টেস্টিমোনিয়াল ডিলিট করা হয়েছে",
      });
    } catch (err) {
      toast({
        title: "ত্রুটি!",
        description: "টেস্টিমোনিয়াল ডিলিট করতে সমস্যা হয়েছে",
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
          টেস্টিমোনিয়াল লোড করতে সমস্যা হয়েছে
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-primary">টেস্টিমোনিয়াল ম্যানেজমেন্ট</h2>
            <p className="text-muted-foreground">
              সকল টেস্টিমোনিয়াল দেখুন, এডিট করুন ও নতুন যোগ করুন
            </p>
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
                  {editingTestimonial
                    ? "টেস্টিমোনিয়াল এডিট করুন"
                    : "নতুন টেস্টিমোনিয়াল যোগ করুন"}
                </DialogTitle>
              </DialogHeader>
              <TestimonialForm
                testimonial={editingTestimonial}
                onSave={handleSave}
                onCancel={() => setIsDialogOpen(false)}
                isLoading={createTestimonial.isPending || updateTestimonial.isPending}
              />
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials?.map((testimonial) => (
            <Card key={testimonial.id} className="p-6">
              <div className="flex items-center gap-4 mb-4">
                {testimonial.image_url ? (
                  <img
                    src={testimonial.image_url}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                    {testimonial.name.charAt(0)}
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{testimonial.name}</h3>
                    {!testimonial.is_published && (
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">
                        Draft
                      </span>
                    )}
                  </div>
                  {testimonial.course && (
                    <p className="text-sm text-muted-foreground">{testimonial.course}</p>
                  )}
                </div>
              </div>
              <div className="flex gap-1 mb-3">
                {Array.from({ length: testimonial.rating || 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                {testimonial.content}
              </p>
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
                  onClick={() => setDeleteId(testimonial.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>টেস্টিমোনিয়াল ডিলিট করতে চান?</AlertDialogTitle>
            <AlertDialogDescription>
              এই কাজটি ফিরিয়ে নেওয়া যাবে না। টেস্টিমোনিয়ালটি স্থায়ীভাবে মুছে যাবে।
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>বাতিল</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground"
            >
              {deleteTestimonial.isPending ? (
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

function TestimonialForm({
  testimonial,
  onSave,
  onCancel,
  isLoading,
}: {
  testimonial: Testimonial | null;
  onSave: (data: TestimonialFormData) => void;
  onCancel: () => void;
  isLoading: boolean;
}) {
  const [formData, setFormData] = useState<TestimonialFormData>(
    testimonial
      ? {
          name: testimonial.name,
          course: testimonial.course || "",
          content: testimonial.content,
          image_url: testimonial.image_url || "",
          rating: testimonial.rating || 5,
          is_published: testimonial.is_published ?? true,
        }
      : emptyFormData
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
        <Label>কোর্সের নাম</Label>
        <Input
          value={formData.course}
          onChange={(e) => setFormData({ ...formData, course: e.target.value })}
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
        <Label>ছবি</Label>
        <div className="mt-2">
          <ImageUpload
            value={formData.image_url}
            onChange={(url) => setFormData({ ...formData, image_url: url })}
            folder="testimonials"
            sizeHint="200x200"
            aspectRatio="1:1"
          />
        </div>
      </div>
      <div>
        <Label>রেটিং (১-৫)</Label>
        <Input
          type="number"
          min={1}
          max={5}
          value={formData.rating}
          onChange={(e) =>
            setFormData({ ...formData, rating: parseInt(e.target.value) || 5 })
          }
        />
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="is_published"
          checked={formData.is_published}
          onCheckedChange={(checked) =>
            setFormData({ ...formData, is_published: checked })
          }
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
