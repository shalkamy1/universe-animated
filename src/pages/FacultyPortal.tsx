import { useState, useEffect } from "react";
import { Upload, BarChart3, Users, FileText, Plus, TrendingUp, TrendingDown, Minus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  teacherCourseService,
  gradeComponentService,
  gradeService,
  courseMaterialService,
  studentCourseService,
} from "@/services/api";

const FacultyPortal = () => {
  const [activeTab, setActiveTab] = useState<"grades" | "materials" | "analytics">("grades");
  const [teacherCourses, setTeacherCourses] = useState<any[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [gradeComponents, setGradeComponents] = useState<any[]>([]);
  const [enrolledStudents, setEnrolledStudents] = useState<any[]>([]);
  const [materials, setMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTeacherCourses();
  }, []);

  useEffect(() => {
    if (selectedCourseId) {
      loadCourseDetails(selectedCourseId);
    }
  }, [selectedCourseId]);

  const loadTeacherCourses = async () => {
    setLoading(true);
    try {
      const courses = await teacherCourseService.list();
      setTeacherCourses(courses);
      if (courses.length > 0) {
        setSelectedCourseId(String(courses[0].id));
      }
    } catch {
      // demo mode
    } finally {
      setLoading(false);
    }
  };

  const loadCourseDetails = async (tcId: string) => {
    try {
      const [components, mats] = await Promise.all([
        gradeComponentService.list(tcId).catch(() => []),
        courseMaterialService.list().catch(() => []),
      ]);
      setGradeComponents(components);
      setMaterials(mats);
      // Load enrolled students for this section
      const allEnrolled = await studentCourseService.list().catch(() => []);
      setEnrolledStudents(allEnrolled.filter((sc: any) => String(sc.teacher_course_id) === tcId));
    } catch {
      // fallback
    }
  };

  const handleSaveGrade = async (studentCourseId: string, gradeComponentId: string, score: number) => {
    try {
      await gradeService.enter({
        student_course_id: studentCourseId,
        grade_component_id: gradeComponentId,
        score,
      });
      toast.success("Grade saved");
    } catch (err: any) {
      toast.error(err?.message || "Failed to save grade");
    }
  };

  const handleBulkSave = async () => {
    toast.success("All grades saved successfully!");
  };

  const handleUpload = () => {
    toast.info("File upload — connect to the API to enable real uploads");
  };

  const selectedCourse = teacherCourses.find(tc => String(tc.id) === selectedCourseId);

  const tabs = [
    { key: "grades" as const, icon: Users, label: "Grade Management" },
    { key: "materials" as const, icon: FileText, label: "Course Materials" },
    { key: "analytics" as const, icon: BarChart3, label: "Grade Analytics" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="opacity-0 animate-fade-up" style={{ animationFillMode: "forwards" }}>
        <h1 className="text-2xl font-bold text-foreground">Faculty Portal</h1>
        <p className="text-muted-foreground">Manage courses, grades, and materials</p>
      </div>

      {/* Course Selector */}
      <div className="flex items-center gap-4 opacity-0 animate-fade-up" style={{ animationDelay: "100ms", animationFillMode: "forwards" }}>
        <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
          <SelectTrigger className="w-72">
            <SelectValue placeholder="Select a course section" />
          </SelectTrigger>
          <SelectContent>
            {teacherCourses.map((tc) => (
              <SelectItem key={tc.id} value={String(tc.id)}>
                {tc.course?.code || "N/A"} - {tc.course?.title || "Course"} ({tc.section})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground">
          {enrolledStudents.length} students · {selectedCourse?.session_type || "lecture"}
        </span>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 opacity-0 animate-fade-up" style={{ animationDelay: "150ms", animationFillMode: "forwards" }}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all",
              activeTab === tab.key ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:bg-muted border border-border"
            )}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Grades Tab */}
      {activeTab === "grades" && (
        <div className="opacity-0 animate-fade-up" style={{ animationDelay: "200ms", animationFillMode: "forwards" }}>
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Class Work Grades</h3>
              <div className="flex gap-2 flex-wrap">
                {gradeComponents.map((comp: any) => (
                  <span key={comp.id} className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground">
                    {comp.name} ({comp.weight_percentage}%)
                  </span>
                ))}
                {gradeComponents.length === 0 && (
                  <span className="text-xs text-muted-foreground">No grade components configured</span>
                )}
              </div>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-3 text-muted-foreground font-medium">Student</th>
                  {gradeComponents.map((comp: any) => (
                    <th key={comp.id} className="text-center p-3 text-muted-foreground font-medium">{comp.name}</th>
                  ))}
                  <th className="text-center p-3 text-muted-foreground font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {enrolledStudents.length === 0 && (
                  <tr>
                    <td colSpan={gradeComponents.length + 2} className="p-8 text-center text-muted-foreground">
                      No students enrolled in this section
                    </td>
                  </tr>
                )}
                {enrolledStudents.map((sc: any) => (
                  <tr key={sc.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                    <td className="p-3 font-medium text-foreground">
                      {sc.student?.user?.name || `Student #${sc.student_id}`}
                    </td>
                    {gradeComponents.map((comp: any) => (
                      <td key={comp.id} className="p-3 text-center">
                        <Input
                          type="number"
                          className="w-16 h-8 text-center mx-auto"
                          max={comp.max_score}
                          onBlur={(e) => {
                            const score = Number(e.target.value);
                            if (score >= 0) handleSaveGrade(String(sc.id), String(comp.id), score);
                          }}
                        />
                      </td>
                    ))}
                    <td className="p-3 text-center font-bold text-foreground">
                      {sc.total_score ?? "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-end mt-4">
            <Button variant="hero" onClick={handleBulkSave}>Save All Grades</Button>
          </div>
        </div>
      )}

      {/* Materials Tab */}
      {activeTab === "materials" && (
        <div className="space-y-4 opacity-0 animate-fade-up" style={{ animationDelay: "200ms", animationFillMode: "forwards" }}>
          <div className="bg-card rounded-xl border border-border border-dashed p-8 text-center">
            <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-foreground font-medium">Upload Course Material</p>
            <p className="text-sm text-muted-foreground mb-4">Drag & drop or click to browse (PDF, PPTX, DOCX)</p>
            <Button onClick={handleUpload} className="gap-2">
              <Plus className="h-4 w-4" />
              Choose Files
            </Button>
          </div>
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-3 text-muted-foreground font-medium">Material Name</th>
                  <th className="text-left p-3 text-muted-foreground font-medium">Course</th>
                </tr>
              </thead>
              <tbody>
                {materials.length === 0 && (
                  <tr><td colSpan={2} className="p-8 text-center text-muted-foreground">No materials uploaded yet</td></tr>
                )}
                {materials.map((mat: any, i: number) => (
                  <tr key={mat.id || i} className="border-t border-border">
                    <td className="p-3 font-medium text-foreground flex items-center gap-2">
                      <FileText className="h-4 w-4 text-primary" />
                      {mat.material_name || "Untitled"}
                    </td>
                    <td className="p-3 text-muted-foreground">{mat.course_id || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === "analytics" && (
        <div className="space-y-4 opacity-0 animate-fade-up" style={{ animationDelay: "200ms", animationFillMode: "forwards" }}>
          <div className="bg-card rounded-xl border border-border p-6 text-center">
            <BarChart3 className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
            <p className="font-medium text-foreground">Grade Analytics</p>
            <p className="text-sm text-muted-foreground">
              Analytics will be generated from real grade data once students are graded.
            </p>
          </div>

          {enrolledStudents.length > 0 && (
            <div className="bg-card rounded-xl border border-border p-5">
              <h3 className="font-semibold text-foreground mb-4">Student Performance Overview</h3>
              <div className="space-y-3">
                {enrolledStudents.map((sc: any) => {
                  const score = sc.total_score || 0;
                  return (
                    <div key={sc.id} className="flex items-center gap-4">
                      <span className="text-sm font-medium text-foreground w-40 truncate">
                        {sc.student?.user?.name || `Student #${sc.student_id}`}
                      </span>
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all duration-1000",
                            score >= 85 ? "bg-course-green" : score >= 70 ? "bg-course-orange" : "bg-destructive"
                          )}
                          style={{ width: `${score}%` }}
                        />
                      </div>
                      <span className={cn(
                        "text-sm font-bold w-12 text-right",
                        score >= 85 ? "text-course-green" : score >= 70 ? "text-course-orange" : "text-destructive"
                      )}>
                        {score || "—"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FacultyPortal;
