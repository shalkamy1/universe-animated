import { useEffect, useState } from "react";
import { BookOpen, CheckCircle2, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { studentService } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";

const CurriculumManagement = () => {
  const { user } = useAuth();
  const [transcript, setTranscript] = useState<any>(null);
  const [cgpa, setCgpa] = useState<any>(null);
  const [gradPct, setGradPct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const studentId = user?.student?.id;
    if (!studentId) { setLoading(false); return; }
    try {
      const [t, g, gp] = await Promise.all([
        studentService.getTranscript(studentId).catch(() => null),
        studentService.getCGPA(studentId).catch(() => null),
        studentService.getGraduationPercentage(studentId).catch(() => null),
      ]);
      setTranscript(t);
      setCgpa(g);
      setGradPct(gp);
    } catch {
      // demo
    } finally {
      setLoading(false);
    }
  };

  const gradeColor = (grade: string) => {
    if (!grade) return "bg-muted text-muted-foreground border-border";
    if (grade.startsWith("A")) return "bg-course-green/10 text-course-green border-course-green/30";
    if (grade.startsWith("B")) return "bg-primary/10 text-primary border-primary/30";
    return "bg-course-orange/10 text-course-orange border-course-orange/30";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const progressPct = gradPct?.percentage || 0;
  const cgpaValue = cgpa?.cgpa || cgpa || "—";
  const semesters = transcript?.semesters || transcript?.data || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="opacity-0 animate-fade-up flex items-center gap-4" style={{ animationFillMode: "forwards" }}>
        <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center">
          <BookOpen className="h-7 w-7 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Curriculum Management</h1>
          <p className="text-muted-foreground">{user?.student?.program || "Your Study Plan"}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Overall Progress", value: `${progressPct}%`, color: "text-primary", hasProgress: true, progress: progressPct },
          { label: "CGPA", value: typeof cgpaValue === "object" ? JSON.stringify(cgpaValue) : String(cgpaValue), color: "text-foreground", hasProgress: false },
          { label: "Credit Hours", value: String(user?.student?.credit_hours || "—"), color: "text-foreground", hasProgress: false },
          { label: "Level", value: String(user?.student?.level || "—"), color: "text-foreground", hasProgress: false },
        ].map((stat, i) => (
          <Card
            key={stat.label}
            className={`opacity-0 animate-fade-up ${i === 0 ? "border-primary/30 bg-gradient-to-br from-primary/5 to-transparent" : ""}`}
            style={{ animationFillMode: "forwards", animationDelay: `${i * 100}ms` }}
          >
            <CardContent className="p-5">
              <p className={`text-sm font-medium ${i === 0 ? "text-primary" : "text-muted-foreground"}`}>{stat.label}</p>
              <p className={`text-3xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
              {stat.hasProgress && <Progress value={stat.progress} className="mt-3 h-2" />}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Transcript */}
      {Array.isArray(semesters) && semesters.length > 0 ? (
        semesters.map((sem: any, si: number) => (
          <Card
            key={si}
            className="opacity-0 animate-fade-up"
            style={{ animationFillMode: "forwards", animationDelay: `${(si + 1) * 200}ms` }}
          >
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-foreground mb-4">{sem.semester?.name || sem.name || `Semester ${si + 1}`}</h2>
              <div className="space-y-3">
                {(sem.courses || sem.student_courses || []).map((course: any, ci: number) => {
                  const c = course.teacher_course?.course || course.course || course;
                  return (
                    <div key={ci} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="h-5 w-5 text-course-green" />
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {c.code || "N/A"} <span className="text-muted-foreground font-normal">{c.credit_hours || 0} credits</span>
                          </p>
                          <p className="text-xs text-muted-foreground">{c.title || c.name || "Course"}</p>
                        </div>
                      </div>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg border ${gradeColor(course.letter_grade || "")}`}>
                        {course.letter_grade || course.grade || "—"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <Card className="opacity-0 animate-fade-up" style={{ animationFillMode: "forwards", animationDelay: "200ms" }}>
          <CardContent className="p-8 text-center">
            <BookOpen className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
            <p className="font-medium text-foreground">No transcript data available</p>
            <p className="text-sm text-muted-foreground">Connect to the API to view your academic transcript</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CurriculumManagement;
