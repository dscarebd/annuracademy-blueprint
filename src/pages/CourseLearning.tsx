import { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ArrowLeft,
  Play,
  CheckCircle2,
  Clock,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Lock,
  Menu,
  X,
  StickyNote,
  Save,
  Trash2,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useCheckEnrollment } from "@/hooks/useEnrollments";
import {
  useLessonProgress,
  useMarkLessonComplete,
  useUnmarkLessonComplete,
  useUpdateEnrollmentProgress,
  useSaveLastWatched,
} from "@/hooks/useLessonProgress";
import { useLessonNote, useSaveNote, useDeleteNote } from "@/hooks/useLessonNotes";
import { useToast } from "@/hooks/use-toast";

interface Lesson {
  name: string;
  duration: string;
  video_url: string;
  preview?: boolean;
}

interface Module {
  title: string;
  lessons: Lesson[];
}

interface Course {
  id: string;
  title: string;
  slug: string;
  modules: Module[];
  instructor: string;
}

const CourseLearning = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [initialPositionSet, setInitialPositionSet] = useState(false);
  const [noteContent, setNoteContent] = useState("");
  const [noteSaving, setNoteSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("video");

  const { data: enrollment, isLoading: enrollmentLoading } = useCheckEnrollment(course?.id || "");
  const { data: lessonProgress } = useLessonProgress(course?.id || "");
  const { data: currentNote } = useLessonNote(course?.id || "", currentModuleIndex, currentLessonIndex);
  const markComplete = useMarkLessonComplete();
  const unmarkComplete = useUnmarkLessonComplete();
  const updateProgress = useUpdateEnrollmentProgress();
  const saveLastWatched = useSaveLastWatched();
  const saveNote = useSaveNote();
  const deleteNote = useDeleteNote();

  // Update note content when lesson changes or note loads
  useEffect(() => {
    setNoteContent(currentNote?.content || "");
  }, [currentNote, currentModuleIndex, currentLessonIndex]);

  // Fetch course
  useEffect(() => {
    const fetchCourse = async () => {
      if (!slug) return;

      const { data, error } = await supabase
        .from("courses")
        .select("id, title, slug, modules, instructor")
        .eq("slug", slug)
        .maybeSingle();

      if (error || !data) {
        navigate("/my-courses");
        return;
      }

      setCourse({
        ...data,
        modules: (data.modules as unknown as Module[]) || [],
      } as Course);
      setIsLoading(false);
    };

    fetchCourse();
  }, [slug, navigate]);

  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/student-login");
      }
    };
    checkAuth();
  }, [navigate]);

  // Calculate total lessons and completed lessons
  const { totalLessons, completedLessons, progressPercent } = useMemo(() => {
    if (!course?.modules) return { totalLessons: 0, completedLessons: 0, progressPercent: 0 };

    let total = 0;
    course.modules.forEach((module) => {
      total += module.lessons?.length || 0;
    });

    const completed = lessonProgress?.length || 0;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { totalLessons: total, completedLessons: completed, progressPercent: percent };
  }, [course, lessonProgress]);

  // Update enrollment progress when lesson progress changes
  useEffect(() => {
    if (course?.id && enrollment && progressPercent !== enrollment.progress) {
      updateProgress.mutate({ courseId: course.id, progress: progressPercent });
    }
  }, [progressPercent, course?.id, enrollment]);

  // Set initial position from last watched
  useEffect(() => {
    if (enrollment && !initialPositionSet && course?.modules) {
      const lastModule = enrollment.last_module_index ?? 0;
      const lastLesson = enrollment.last_lesson_index ?? 0;
      
      // Validate indices are within bounds
      const moduleCount = course.modules.length;
      const validModule = Math.min(lastModule, moduleCount - 1);
      const lessonCount = course.modules[validModule]?.lessons?.length || 0;
      const validLesson = Math.min(lastLesson, lessonCount - 1);
      
      setCurrentModuleIndex(Math.max(0, validModule));
      setCurrentLessonIndex(Math.max(0, validLesson));
      setInitialPositionSet(true);
    }
  }, [enrollment, initialPositionSet, course]);

  // Save last watched position when lesson changes
  useEffect(() => {
    if (course?.id && initialPositionSet) {
      saveLastWatched.mutate({
        courseId: course.id,
        moduleIndex: currentModuleIndex,
        lessonIndex: currentLessonIndex,
      });
    }
  }, [currentModuleIndex, currentLessonIndex, course?.id, initialPositionSet]);

  const isLessonCompleted = (moduleIndex: number, lessonIndex: number) => {
    return lessonProgress?.some(
      (p) => p.module_index === moduleIndex && p.lesson_index === lessonIndex
    );
  };

  const handleToggleComplete = async (moduleIndex: number, lessonIndex: number) => {
    if (!course) return;

    const completed = isLessonCompleted(moduleIndex, lessonIndex);

    if (completed) {
      await unmarkComplete.mutateAsync({
        courseId: course.id,
        moduleIndex,
        lessonIndex,
      });
      toast({ title: "লেসন অসম্পূর্ণ হিসেবে চিহ্নিত হয়েছে" });
    } else {
      await markComplete.mutateAsync({
        courseId: course.id,
        moduleIndex,
        lessonIndex,
      });
      toast({ title: "লেসন সম্পন্ন হিসেবে চিহ্নিত হয়েছে" });
    }
  };

  const handleSaveNote = useCallback(async () => {
    if (!course) return;
    setNoteSaving(true);
    try {
      await saveNote.mutateAsync({
        courseId: course.id,
        moduleIndex: currentModuleIndex,
        lessonIndex: currentLessonIndex,
        content: noteContent,
      });
      toast({ title: "নোট সেভ হয়েছে" });
    } catch (error) {
      toast({ title: "নোট সেভ করতে সমস্যা হয়েছে", variant: "destructive" });
    } finally {
      setNoteSaving(false);
    }
  }, [course, currentModuleIndex, currentLessonIndex, noteContent, saveNote, toast]);

  const handleDeleteNote = async () => {
    if (!course) return;
    try {
      await deleteNote.mutateAsync({
        courseId: course.id,
        moduleIndex: currentModuleIndex,
        lessonIndex: currentLessonIndex,
      });
      setNoteContent("");
      toast({ title: "নোট মুছে ফেলা হয়েছে" });
    } catch (error) {
      toast({ title: "নোট মুছতে সমস্যা হয়েছে", variant: "destructive" });
    }
  };

  const currentLesson = course?.modules?.[currentModuleIndex]?.lessons?.[currentLessonIndex];
  const currentModule = course?.modules?.[currentModuleIndex];

  const goToNextLesson = () => {
    if (!course?.modules) return;

    const currentModuleLessons = course.modules[currentModuleIndex]?.lessons?.length || 0;

    if (currentLessonIndex < currentModuleLessons - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1);
    } else if (currentModuleIndex < course.modules.length - 1) {
      setCurrentModuleIndex(currentModuleIndex + 1);
      setCurrentLessonIndex(0);
    }
  };

  const goToPrevLesson = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1);
    } else if (currentModuleIndex > 0) {
      const prevModuleLessons = course?.modules[currentModuleIndex - 1]?.lessons?.length || 0;
      setCurrentModuleIndex(currentModuleIndex - 1);
      setCurrentLessonIndex(prevModuleLessons - 1);
    }
  };

  const hasNextLesson = () => {
    if (!course?.modules) return false;
    const currentModuleLessons = course.modules[currentModuleIndex]?.lessons?.length || 0;
    return (
      currentLessonIndex < currentModuleLessons - 1 ||
      currentModuleIndex < course.modules.length - 1
    );
  };

  const hasPrevLesson = () => {
    return currentLessonIndex > 0 || currentModuleIndex > 0;
  };

  // Extract YouTube video ID
  const getYouTubeEmbedUrl = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    const videoId = match && match[2].length === 11 ? match[2] : null;
    return videoId ? `https://www.youtube.com/embed/${videoId}?rel=0` : null;
  };

  if (isLoading || enrollmentLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!enrollment) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
        <Lock className="w-16 h-16 text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-2">অ্যাক্সেস নেই</h1>
        <p className="text-muted-foreground mb-6 text-center">
          এই কোর্সে আপনার এনরোলমেন্ট নেই। কোর্সটি কিনুন অথবা আপনার কোর্সে ফিরে যান।
        </p>
        <div className="flex gap-4">
          <Link to={`/courses/${slug}`}>
            <Button>কোর্স দেখুন</Button>
          </Link>
          <Link to="/my-courses">
            <Button variant="outline">আমার কোর্স</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-80 bg-card border-r transform transition-transform duration-300 lg:relative lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-4 border-b">
            <div className="flex items-center justify-between mb-4">
              <Link to="/my-courses" className="text-muted-foreground hover:text-primary">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <h2 className="font-semibold text-foreground line-clamp-2">{course?.title}</h2>
            <p className="text-sm text-muted-foreground mt-1">{course?.instructor}</p>

            {/* Progress */}
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">অগ্রগতি</span>
                <span className="font-medium text-primary">
                  {completedLessons}/{totalLessons} লেসন
                </span>
              </div>
              <Progress value={progressPercent} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1 text-right">{progressPercent}% সম্পন্ন</p>
            </div>
          </div>

          {/* Course Content */}
          <ScrollArea className="flex-1">
            <div className="p-2">
              <Accordion type="multiple" defaultValue={[`module-${currentModuleIndex}`]} className="space-y-1">
                {course?.modules?.map((module, moduleIndex) => (
                  <AccordionItem
                    key={moduleIndex}
                    value={`module-${moduleIndex}`}
                    className="border rounded-lg overflow-hidden"
                  >
                    <AccordionTrigger className="px-3 py-2 hover:no-underline hover:bg-muted/50">
                      <div className="flex items-start gap-2 text-left">
                        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded mt-0.5">
                          {moduleIndex + 1}
                        </span>
                        <span className="text-sm font-medium">{module.title}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-0">
                      <div className="space-y-0.5 pb-2">
                        {module.lessons?.map((lesson, lessonIndex) => {
                          const isActive =
                            currentModuleIndex === moduleIndex && currentLessonIndex === lessonIndex;
                          const completed = isLessonCompleted(moduleIndex, lessonIndex);

                          return (
                            <button
                              key={lessonIndex}
                              onClick={() => {
                                setCurrentModuleIndex(moduleIndex);
                                setCurrentLessonIndex(lessonIndex);
                                setSidebarOpen(false);
                              }}
                              className={`w-full flex items-center gap-2 px-3 py-2 text-left text-sm transition-colors ${
                                isActive
                                  ? "bg-primary/10 text-primary"
                                  : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                              }`}
                            >
                              {completed ? (
                                <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                              ) : (
                                <Play className="w-4 h-4 shrink-0" />
                              )}
                              <span className="flex-1 line-clamp-1">{lesson.name}</span>
                              <span className="text-xs text-muted-foreground">{lesson.duration}</span>
                            </button>
                          );
                        })}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </ScrollArea>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="sticky top-0 z-40 bg-background border-b px-4 py-3 flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-muted-foreground hover:text-foreground"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">
              মডিউল {currentModuleIndex + 1}: {currentModule?.title}
            </p>
            <h1 className="font-semibold text-foreground">{currentLesson?.name}</h1>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="hidden sm:flex">
              <Clock className="w-3 h-3 mr-1" />
              {currentLesson?.duration}
            </Badge>
            <Button
              variant={activeTab === "notes" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab(activeTab === "notes" ? "video" : "notes")}
              className="gap-1"
            >
              <StickyNote className="w-4 h-4" />
              <span className="hidden sm:inline">নোট</span>
            </Button>
          </div>
        </header>

        {/* Content Area - Video or Notes */}
        <div className="flex-1 bg-black overflow-hidden">
          {activeTab === "video" ? (
            // Video Player
            currentLesson?.video_url && getYouTubeEmbedUrl(currentLesson.video_url) ? (
              <div className="w-full h-full flex items-center justify-center">
                <iframe
                  src={getYouTubeEmbedUrl(currentLesson.video_url)!}
                  title={currentLesson.name}
                  className="w-full aspect-video max-h-[calc(100vh-250px)]"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white">
                <div className="text-center">
                  <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>ভিডিও পাওয়া যায়নি</p>
                </div>
              </div>
            )
          ) : (
            // Notes Panel
            <div className="w-full h-full bg-background p-4 overflow-auto">
              <div className="max-w-3xl mx-auto">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <StickyNote className="w-5 h-5 text-primary" />
                    এই লেসনের নোট
                  </h2>
                  <div className="flex items-center gap-2">
                    {currentNote && noteContent && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDeleteNote}
                        disabled={deleteNote.isPending}
                        className="text-destructive hover:text-destructive gap-1"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span className="hidden sm:inline">মুছুন</span>
                      </Button>
                    )}
                    <Button
                      size="sm"
                      onClick={handleSaveNote}
                      disabled={noteSaving || !noteContent.trim()}
                      className="gap-1 gradient-purple text-white"
                    >
                      {noteSaving ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      <span className="hidden sm:inline">সেভ করুন</span>
                    </Button>
                  </div>
                </div>
                <Textarea
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder="এই লেসন থেকে আপনার নোট এখানে লিখুন..."
                  className="min-h-[300px] resize-none text-base"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  টিপ: ভিডিও দেখার সময় গুরুত্বপূর্ণ পয়েন্টগুলো নোট করে রাখুন
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Controls */}
        <div className="border-t bg-card p-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-4xl mx-auto">
            {/* Mark Complete */}
            <div className="flex items-center gap-3">
              <Checkbox
                id="mark-complete"
                checked={isLessonCompleted(currentModuleIndex, currentLessonIndex)}
                onCheckedChange={() => handleToggleComplete(currentModuleIndex, currentLessonIndex)}
              />
              <label
                htmlFor="mark-complete"
                className="text-sm font-medium cursor-pointer select-none"
              >
                সম্পন্ন হিসেবে চিহ্নিত করুন
              </label>
            </div>

            {/* Navigation */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={goToPrevLesson}
                disabled={!hasPrevLesson()}
                className="gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">পূর্ববর্তী</span>
              </Button>
              <Button
                onClick={goToNextLesson}
                disabled={!hasNextLesson()}
                className="gap-1 gradient-purple text-white"
              >
                <span className="hidden sm:inline">পরবর্তী</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default CourseLearning;
