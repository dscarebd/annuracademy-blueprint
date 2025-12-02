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

interface Course {
  id: number;
  title: string;
  description: string;
  price: string;
  originalPrice: string;
  image: string;
  students: number;
  lessons: number;
}

const initialCourses: Course[] = [
  {
    id: 1,
    title: "WordPress Masterclass",
    description: "ওয়ার্ডপ্রেস দিয়ে প্রফেশনাল ওয়েবসাইট তৈরি করুন",
    price: "৳১,৯৯০",
    originalPrice: "৳২,৯৯০",
    image: "/src/assets/course-wordpress.jpg",
    students: 1250,
    lessons: 45,
  },
  {
    id: 2,
    title: "Figma to Dev",
    description: "ফিগমা থেকে কোড করা শিখুন",
    price: "৳২,৪৯০",
    originalPrice: "৳৩,৪৯০",
    image: "/src/assets/course-figma.jpg",
    students: 890,
    lessons: 38,
  },
  {
    id: 3,
    title: "Remote Job Masterclass",
    description: "রিমোট জব পেতে কমপ্লিট গাইডলাইন",
    price: "৳১,৪৯০",
    originalPrice: "৳১,৯৯০",
    image: "/src/assets/course-remote-job.jpg",
    students: 2100,
    lessons: 32,
  },
];

export default function AdminCourses() {
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSave = (course: Course) => {
    if (editingCourse) {
      setCourses(courses.map((c) => (c.id === course.id ? course : c)));
    } else {
      setCourses([...courses, { ...course, id: Date.now() }]);
    }
    setIsDialogOpen(false);
    setEditingCourse(null);
  };

  const handleDelete = (id: number) => {
    setCourses(courses.filter((c) => c.id !== id));
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-primary">কোর্স ম্যানেজমেন্ট</h2>
            <p className="text-muted-foreground">সকল কোর্স দেখুন, এডিট করুন ও নতুন কোর্স যোগ করুন</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingCourse(null)}>
                <Plus className="h-4 w-4 mr-2" />
                নতুন কোর্স
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingCourse ? "কোর্স এডিট করুন" : "নতুন কোর্স যোগ করুন"}
                </DialogTitle>
              </DialogHeader>
              <CourseForm
                course={editingCourse}
                onSave={handleSave}
                onCancel={() => setIsDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card key={course.id} className="overflow-hidden">
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-40 object-cover"
              />
              <div className="p-4 space-y-3">
                <h3 className="font-semibold text-lg">{course.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {course.description}
                </p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{course.students} শিক্ষার্থী</span>
                  <span>{course.lessons} লেসন</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-lg font-bold text-primary">{course.price}</span>
                    <span className="text-sm text-muted-foreground line-through ml-2">
                      {course.originalPrice}
                    </span>
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
                      onClick={() => handleDelete(course.id)}
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

function CourseForm({
  course,
  onSave,
  onCancel,
}: {
  course: Course | null;
  onSave: (course: Course) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState<Course>(
    course || {
      id: 0,
      title: "",
      description: "",
      price: "",
      originalPrice: "",
      image: "",
      students: 0,
      lessons: 0,
    }
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
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>মূল্য</Label>
          <Input
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          />
        </div>
        <div>
          <Label>আগের মূল্য</Label>
          <Input
            value={formData.originalPrice}
            onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>লেসন সংখ্যা</Label>
          <Input
            type="number"
            value={formData.lessons}
            onChange={(e) => setFormData({ ...formData, lessons: parseInt(e.target.value) || 0 })}
          />
        </div>
        <div>
          <Label>শিক্ষার্থী সংখ্যা</Label>
          <Input
            type="number"
            value={formData.students}
            onChange={(e) => setFormData({ ...formData, students: parseInt(e.target.value) || 0 })}
          />
        </div>
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
