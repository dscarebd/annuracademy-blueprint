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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Plus, Edit, Trash2, Loader2, X } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  useAdminCourses,
  useCreateCourse,
  useUpdateCourse,
  useDeleteCourse,
  Course,
  CourseInsert,
  CourseModule,
} from "@/hooks/useCourses";

interface CourseFormData {
  title: string;
  slug: string;
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
  rating: number;
  review_count: number;
  is_free: boolean;
  is_published: boolean;
  learning_outcomes: string[];
  requirements: string[];
  modules: CourseModule[];
}

const emptyFormData: CourseFormData = {
  title: "",
  slug: "",
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
  rating: 0,
  review_count: 0,
  is_free: false,
  is_published: true,
  learning_outcomes: [],
  requirements: [],
  modules: [],
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
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
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

// Default values that match the course detail page
const defaultLearningOutcomes = [
  "বেসিক থেকে অ্যাডভান্সড লেভেল পর্যন্ত সম্পূর্ণ ধারণা",
  "রিয়েল-ওয়ার্ল্ড প্রজেক্ট তৈরির অভিজ্ঞতা",
  "ইন্ডাস্ট্রি স্ট্যান্ডার্ড বেস্ট প্র্যাক্টিস",
  "প্রফেশনাল পোর্টফোলিও তৈরি",
  "জব রেডি স্কিল ডেভেলপমেন্ট",
  "লাইফটাইম সাপোর্ট ও আপডেট",
];

const defaultRequirements = [
  "কম্পিউটার বা ল্যাপটপ (উইন্ডোজ/ম্যাক)",
  "ইন্টারনেট কানেকশন",
  "বেসিক কম্পিউটার স্কিল",
  "শেখার আগ্রহ ও ধৈর্য",
];

const defaultModules: CourseModule[] = [
  { 
    title: "পরিচিতি", 
    lessons: [
      { name: "কোর্স ওভারভিউ", duration: "04:02", preview: false },
      { name: "সফটওয়্যার ইনস্টলেশন", duration: "02:14", preview: false },
      { name: "ইন্টারফেস পরিচিতি", duration: "06:53", preview: false },
    ]
  },
  { 
    title: "বেসিক কনসেপ্ট", 
    lessons: [
      { name: "ফান্ডামেন্টাল ধারণা", duration: "10:20", preview: false },
      { name: "টুলস ও টেকনিক", duration: "08:45", preview: false },
    ]
  },
];

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
  const getInitialFormData = (): CourseFormData => {
    if (!course) return emptyFormData;
    
    const outcomes = course.learning_outcomes as string[] | null;
    const reqs = course.requirements as string[] | null;
    const mods = course.modules as CourseModule[] | null;
    
    return {
      title: course.title,
      slug: course.slug || "",
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
      rating: course.rating || 0,
      review_count: course.review_count || 0,
      is_free: course.is_free || false,
      is_published: course.is_published ?? true,
      learning_outcomes: outcomes && outcomes.length > 0 ? outcomes : defaultLearningOutcomes,
      requirements: reqs && reqs.length > 0 ? reqs : defaultRequirements,
      modules: mods && mods.length > 0 ? mods : defaultModules,
    };
  };

  const [formData, setFormData] = useState<CourseFormData>(getInitialFormData());

  const [newOutcome, setNewOutcome] = useState("");
  const [newRequirement, setNewRequirement] = useState("");

  const addOutcome = () => {
    if (newOutcome.trim()) {
      setFormData({
        ...formData,
        learning_outcomes: [...formData.learning_outcomes, newOutcome.trim()],
      });
      setNewOutcome("");
    }
  };

  const removeOutcome = (index: number) => {
    setFormData({
      ...formData,
      learning_outcomes: formData.learning_outcomes.filter((_, i) => i !== index),
    });
  };

  const addRequirement = () => {
    if (newRequirement.trim()) {
      setFormData({
        ...formData,
        requirements: [...formData.requirements, newRequirement.trim()],
      });
      setNewRequirement("");
    }
  };

  const removeRequirement = (index: number) => {
    setFormData({
      ...formData,
      requirements: formData.requirements.filter((_, i) => i !== index),
    });
  };

  const addModule = () => {
    setFormData({
      ...formData,
      modules: [...formData.modules, { title: "নতুন মডিউল", lessons: [] }],
    });
  };

  const updateModuleTitle = (index: number, title: string) => {
    const updated = [...formData.modules];
    updated[index].title = title;
    setFormData({ ...formData, modules: updated });
  };

  const removeModule = (index: number) => {
    setFormData({
      ...formData,
      modules: formData.modules.filter((_, i) => i !== index),
    });
  };

  const addLesson = (moduleIndex: number) => {
    const updated = [...formData.modules];
    updated[moduleIndex].lessons.push({
      name: "নতুন লেসন",
      duration: "00:00",
      preview: false,
    });
    setFormData({ ...formData, modules: updated });
  };

  const updateLesson = (
    moduleIndex: number,
    lessonIndex: number,
    field: string,
    value: string | boolean
  ) => {
    const updated = [...formData.modules];
    updated[moduleIndex].lessons[lessonIndex] = {
      ...updated[moduleIndex].lessons[lessonIndex],
      [field]: value,
    };
    setFormData({ ...formData, modules: updated });
  };

  const removeLesson = (moduleIndex: number, lessonIndex: number) => {
    const updated = [...formData.modules];
    updated[moduleIndex].lessons = updated[moduleIndex].lessons.filter(
      (_, i) => i !== lessonIndex
    );
    setFormData({ ...formData, modules: updated });
  };

  return (
    <Tabs defaultValue="basic" className="w-full">
      <TabsList className="grid w-full grid-cols-6">
        <TabsTrigger value="basic">বেসিক</TabsTrigger>
        <TabsTrigger value="description">কোর্স বিবরণ</TabsTrigger>
        <TabsTrigger value="outcomes">যা শিখবেন</TabsTrigger>
        <TabsTrigger value="requirements">প্রয়োজনীয়তা</TabsTrigger>
        <TabsTrigger value="modules">মডিউল</TabsTrigger>
        <TabsTrigger value="instructor">ইন্সট্রাক্টর</TabsTrigger>
      </TabsList>

      <TabsContent value="basic" className="space-y-4 mt-4">
        <div>
          <Label>কোর্সের নাম</Label>
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
      </TabsContent>

      <TabsContent value="description" className="space-y-4 mt-4">
        <div>
          <Label>কোর্স বিবরণ (Course Description)</Label>
          <Textarea
            value={formData.description}
            rows={10}
            placeholder="এই কোর্সের বিস্তারিত বিবরণ লিখুন..."
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="mt-2"
          />
          <p className="text-xs text-muted-foreground mt-1">
            এই বিবরণ কোর্স ডিটেইল পেজে দেখানো হবে
          </p>
        </div>
      </TabsContent>

      <TabsContent value="outcomes" className="space-y-4 mt-4">
        <div>
          <Label>যা শিখবেন (Learning Outcomes)</Label>
          <div className="flex gap-2 mt-2">
            <Input
              value={newOutcome}
              onChange={(e) => setNewOutcome(e.target.value)}
              placeholder="নতুন আইটেম যোগ করুন..."
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addOutcome())}
            />
            <Button type="button" onClick={addOutcome}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="space-y-2">
          {formData.learning_outcomes.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-2 p-2 bg-muted rounded"
            >
              <span className="flex-1">{item}</span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeOutcome(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {formData.learning_outcomes.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              কোনো আইটেম যোগ করা হয়নি
            </p>
          )}
        </div>
      </TabsContent>

      <TabsContent value="requirements" className="space-y-4 mt-4">
        <div>
          <Label>প্রয়োজনীয়তা (Requirements)</Label>
          <div className="flex gap-2 mt-2">
            <Input
              value={newRequirement}
              onChange={(e) => setNewRequirement(e.target.value)}
              placeholder="নতুন আইটেম যোগ করুন..."
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addRequirement())}
            />
            <Button type="button" onClick={addRequirement}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="space-y-2">
          {formData.requirements.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-2 p-2 bg-muted rounded"
            >
              <span className="flex-1">{item}</span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeRequirement(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {formData.requirements.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              কোনো আইটেম যোগ করা হয়নি
            </p>
          )}
        </div>
      </TabsContent>

      <TabsContent value="modules" className="space-y-4 mt-4">
        <div className="flex justify-between items-center">
          <Label>কোর্স মডিউল</Label>
          <Button type="button" size="sm" onClick={addModule}>
            <Plus className="h-4 w-4 mr-1" />
            মডিউল যোগ করুন
          </Button>
        </div>
        <div className="space-y-4">
          {formData.modules.map((module, moduleIndex) => (
            <Card key={moduleIndex} className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Input
                  value={module.title}
                  onChange={(e) => updateModuleTitle(moduleIndex, e.target.value)}
                  placeholder="মডিউলের নাম"
                  className="font-medium"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeModule(moduleIndex)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
              <div className="space-y-2 ml-4">
                {module.lessons.map((lesson, lessonIndex) => (
                  <div
                    key={lessonIndex}
                    className="flex items-center gap-2 p-2 bg-muted/50 rounded"
                  >
                    <Input
                      value={lesson.name}
                      onChange={(e) =>
                        updateLesson(moduleIndex, lessonIndex, "name", e.target.value)
                      }
                      placeholder="লেসনের নাম"
                      className="flex-1"
                    />
                    <Input
                      value={lesson.duration}
                      onChange={(e) =>
                        updateLesson(moduleIndex, lessonIndex, "duration", e.target.value)
                      }
                      placeholder="00:00"
                      className="w-20"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeLesson(moduleIndex, lessonIndex)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addLesson(moduleIndex)}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  লেসন যোগ করুন
                </Button>
              </div>
            </Card>
          ))}
          {formData.modules.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              কোনো মডিউল যোগ করা হয়নি
            </p>
          )}
        </div>
      </TabsContent>

      <TabsContent value="instructor" className="space-y-4 mt-4">
        <div>
          <Label>ইন্সট্রাক্টরের নাম</Label>
          <Input
            value={formData.instructor}
            placeholder="ইন্সট্রাক্টরের নাম"
            onChange={(e) =>
              setFormData({ ...formData, instructor: e.target.value })
            }
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>রেটিং</Label>
            <Input
              type="number"
              step="0.1"
              min="0"
              max="5"
              value={formData.rating}
              onChange={(e) =>
                setFormData({ ...formData, rating: parseFloat(e.target.value) || 0 })
              }
            />
          </div>
          <div>
            <Label>রিভিউ সংখ্যা</Label>
            <Input
              type="number"
              value={formData.review_count}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  review_count: parseInt(e.target.value) || 0,
                })
              }
            />
          </div>
        </div>
      </TabsContent>

      <div className="flex gap-2 justify-end mt-6 pt-4 border-t">
        <Button variant="outline" onClick={onCancel} disabled={isLoading}>
          বাতিল
        </Button>
        <Button onClick={() => onSave(formData)} disabled={isLoading}>
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          সেভ করুন
        </Button>
      </div>
    </Tabs>
  );
}