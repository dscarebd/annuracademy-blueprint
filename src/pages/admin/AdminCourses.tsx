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
import {
  useAdminCourses,
  useCreateCourse,
  useUpdateCourse,
  useDeleteCourse,
  Course,
  CourseInsert,
} from "@/hooks/useCourses";

interface CourseFormData {
  title: string;
  description: string;
  price: number;
  original_price: number | null;
  image_url: string;
  duration: string;
  instructor: string;
  category: string;
  level: string;
  students_count: number;
  lessons_count: number;
  is_free: boolean;
  is_published: boolean;
}

const emptyFormData: CourseFormData = {
  title: "",
  description: "",
  price: 0,
  original_price: null,
  image_url: "",
  duration: "",
  instructor: "NUR AL-AMIN",
  category: "",
  level: "Beginner",
  students_count: 0,
  lessons_count: 0,
  is_free: false,
  is_published: true,
};

export default function AdminCourses() {
  const { data: courses, isLoading, error } = useAdminCourses();
  const createCourse = useCreateCourse();
  const updateCourse = useUpdateCourse();
  const deleteCourse = useDeleteCourse();
  const { toast } = useToast();

  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleSave = async (formData: CourseFormData) => {
    try {
      if (editingCourse) {
        await updateCourse.mutateAsync({
          id: editingCourse.id,
          ...formData,
        });
        toast({
          title: "সফল!",
          description: "কোর্স আপডেট করা হয়েছে",
        });
      } else {
        await createCourse.mutateAsync(formData as CourseInsert);
        toast({
          title: "সফল!",
          description: "নতুন কোর্স যোগ করা হয়েছে",
        });
      }
      setIsDialogOpen(false);
      setEditingCourse(null);
    } catch (err) {
      toast({
        title: "ত্রুটি!",
        description: "কোর্স সেভ করতে সমস্যা হয়েছে",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteCourse.mutateAsync(deleteId);
      toast({
        title: "সফল!",
        description: "কোর্স ডিলিট করা হয়েছে",
      });
    } catch (err) {
      toast({
        title: "ত্রুটি!",
        description: "কোর্স ডিলিট করতে সমস্যা হয়েছে",
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
          কোর্স লোড করতে সমস্যা হয়েছে
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-primary">কোর্স ম্যানেজমেন্ট</h2>
            <p className="text-muted-foreground">
              সকল কোর্স দেখুন, এডিট করুন ও নতুন কোর্স যোগ করুন
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingCourse(null)}>
                <Plus className="h-4 w-4 mr-2" />
                নতুন কোর্স
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingCourse ? "কোর্স এডিট করুন" : "নতুন কোর্স যোগ করুন"}
                </DialogTitle>
              </DialogHeader>
              <CourseForm
                course={editingCourse}
                onSave={handleSave}
                onCancel={() => setIsDialogOpen(false)}
                isLoading={createCourse.isPending || updateCourse.isPending}
              />
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses?.map((course) => (
            <Card key={course.id} className="overflow-hidden">
              <img
                src={course.image_url || ''}
                alt={course.title}
                className="w-full h-40 object-cover"
              />
              <div className="p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-lg flex-1">{course.title}</h3>
                  {!course.is_published && (
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                      Draft
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {course.description}
                </p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{course.students_count || 0} শিক্ষার্থী</span>
                  <span>{course.lessons_count || 0} লেসন</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-lg font-bold text-primary">
                      {course.is_free ? "ফ্রি" : `৳${course.price.toLocaleString()}`}
                    </span>
                    {course.original_price && (
                      <span className="text-sm text-muted-foreground line-through ml-2">
                        ৳{course.original_price.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        setEditingCourse(course);
                        setIsDialogOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="text-destructive"
                      onClick={() => setDeleteId(course.id)}
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
            <AlertDialogTitle>কোর্স ডিলিট করতে চান?</AlertDialogTitle>
            <AlertDialogDescription>
              এই কাজটি ফিরিয়ে নেওয়া যাবে না। কোর্সটি স্থায়ীভাবে মুছে যাবে।
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>বাতিল</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground"
            >
              {deleteCourse.isPending ? (
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

function CourseForm({
  course,
  onSave,
  onCancel,
  isLoading,
}: {
  course: Course | null;
  onSave: (data: CourseFormData) => void;
  onCancel: () => void;
  isLoading: boolean;
}) {
  const [formData, setFormData] = useState<CourseFormData>(
    course
      ? {
          title: course.title,
          description: course.description || "",
          price: course.price,
          original_price: course.original_price,
          image_url: course.image_url || "",
          duration: course.duration || "",
          instructor: course.instructor,
          category: course.category,
          level: course.level || "Beginner",
          students_count: course.students_count || 0,
          lessons_count: course.lessons_count || 0,
          is_free: course.is_free || false,
          is_published: course.is_published ?? true,
        }
      : emptyFormData
  );

  return (
    <div className="space-y-4">
      <div>
        <Label>কোর্সের নাম</Label>
        <Input
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
      </div>
      <div>
        <Label>বিবরণ</Label>
        <Textarea
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>মূল্য (৳)</Label>
          <Input
            type="number"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: parseInt(e.target.value) || 0 })
            }
          />
        </div>
        <div>
          <Label>আগের মূল্য (৳)</Label>
          <Input
            type="number"
            value={formData.original_price || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                original_price: e.target.value ? parseInt(e.target.value) : null,
              })
            }
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>ক্যাটেগরি</Label>
          <Input
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
          />
        </div>
        <div>
          <Label>লেভেল</Label>
          <Input
            value={formData.level}
            onChange={(e) => setFormData({ ...formData, level: e.target.value })}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>সময়কাল</Label>
          <Input
            value={formData.duration}
            placeholder="e.g. 2h 30m"
            onChange={(e) =>
              setFormData({ ...formData, duration: e.target.value })
            }
          />
        </div>
        <div>
          <Label>ইন্সট্রাক্টর</Label>
          <Input
            value={formData.instructor}
            onChange={(e) =>
              setFormData({ ...formData, instructor: e.target.value })
            }
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>লেসন সংখ্যা</Label>
          <Input
            type="number"
            value={formData.lessons_count}
            onChange={(e) =>
              setFormData({
                ...formData,
                lessons_count: parseInt(e.target.value) || 0,
              })
            }
          />
        </div>
        <div>
          <Label>শিক্ষার্থী সংখ্যা</Label>
          <Input
            type="number"
            value={formData.students_count}
            onChange={(e) =>
              setFormData({
                ...formData,
                students_count: parseInt(e.target.value) || 0,
              })
            }
          />
        </div>
      </div>
      <div>
        <Label>ছবির URL</Label>
        <Input
          value={formData.image_url}
          placeholder="/src/assets/course-image.jpg"
          onChange={(e) =>
            setFormData({ ...formData, image_url: e.target.value })
          }
        />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Switch
            id="is_free"
            checked={formData.is_free}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, is_free: checked })
            }
          />
          <Label htmlFor="is_free">ফ্রি কোর্স</Label>
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
