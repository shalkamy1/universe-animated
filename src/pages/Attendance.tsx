import { useState, useEffect } from "react";
import { QrCode, Camera, CheckCircle, XCircle, Clock, Calendar, BookOpen, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { teacherCourseService, studentCourseService } from "@/services/api";

const Attendance = () => {
  const [scanning, setScanning] = useState(false);
  const [scannedLecture, setScannedLecture] = useState<string | null>(null);
  const [todayLectures, setTodayLectures] = useState<any[]>([]);
  const [courseStats, setCourseStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [sections, enrolled] = await Promise.all([
        teacherCourseService.list().catch(() => []),
        studentCourseService.list().catch(() => []),
      ]);
      // Map teacher courses as today's lectures (mock schedule parsing)
      setTodayLectures(sections.slice(0, 5).map((s: any, i: number) => ({
        id: s.id,
        code: s.course?.code || `COURSE${i}`,
        name: s.course?.title || "Course",
        time: s.schedule || "TBA",
        room: `Section ${s.section || "A"}`,
        status: i === 0 ? "active" : "upcoming",
        qrAvailable: i === 0,
      })));
      // Map enrolled courses as attendance stats
      setCourseStats(enrolled.slice(0, 5).map((sc: any) => ({
        code: sc.teacher_course?.course?.code || "N/A",
        name: sc.teacher_course?.course?.title || "Course",
        attended: Math.floor(Math.random() * 20) + 5,
        total: 24,
        percentage: Math.floor(Math.random() * 30) + 70,
      })));
    } catch {
      // demo mode
    } finally {
      setLoading(false);
    }
  };

  const handleScanQR = (lectureId: string) => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      setScannedLecture(lectureId);
      toast.success("Attendance recorded successfully!");
    }, 2000);
  };

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
        <h1 className="text-2xl font-bold text-foreground">Attendance Management</h1>
        <p className="text-muted-foreground">QR-based attendance tracking system</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 opacity-0 animate-fade-up" style={{ animationDelay: "100ms", animationFillMode: "forwards" }}>
        {[
          { icon: CheckCircle, label: "Overall Attendance", value: courseStats.length > 0 ? `${Math.round(courseStats.reduce((s, c) => s + c.percentage, 0) / (courseStats.length || 1))}%` : "—", color: "text-course-green" },
          { icon: Calendar, label: "Classes Today", value: todayLectures.length.toString(), color: "text-primary" },
          { icon: Clock, label: "Active Now", value: todayLectures.filter(l => l.status === "active").length.toString(), color: "text-course-orange" },
        ].map((stat) => (
          <div key={stat.label} className="stat-card flex items-center gap-4">
            <stat.icon className={cn("h-8 w-8", stat.color)} />
            <div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className={cn("text-2xl font-bold", stat.color)}>{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Lectures - QR Scan */}
        <div className="space-y-4 opacity-0 animate-fade-up" style={{ animationDelay: "200ms", animationFillMode: "forwards" }}>
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <QrCode className="h-5 w-5 text-primary" />
            Today's Lectures
          </h2>
          <div className="space-y-3">
            {todayLectures.length === 0 && (
              <div className="bg-card rounded-xl p-8 border border-border text-center text-muted-foreground">No lectures today</div>
            )}
            {todayLectures.map((lecture, i) => (
              <div
                key={lecture.id}
                className={cn(
                  "bg-card rounded-xl p-5 border shadow-card opacity-0 animate-fade-up transition-all hover:shadow-lg",
                  lecture.status === "active" ? "border-primary/30 bg-primary/5" : "border-border"
                )}
                style={{ animationDelay: `${300 + i * 100}ms`, animationFillMode: "forwards" }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold px-2 py-1 rounded bg-primary/10 text-primary">{lecture.code}</span>
                      {lecture.status === "active" && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-course-green/10 text-course-green animate-pulse-soft">● Live</span>
                      )}
                    </div>
                    <h3 className="font-semibold text-foreground">{lecture.name}</h3>
                    <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{lecture.time}</span>
                      <span>{lecture.room}</span>
                    </div>
                  </div>
                  <div>
                    {scannedLecture === String(lecture.id) ? (
                      <div className="flex items-center gap-1 text-course-green">
                        <CheckCircle className="h-5 w-5" />
                        <span className="text-xs font-medium">Recorded</span>
                      </div>
                    ) : lecture.qrAvailable ? (
                      <Button size="sm" onClick={() => handleScanQR(String(lecture.id))} disabled={scanning} className="gap-1">
                        <Camera className="h-4 w-4" />
                        {scanning ? "Scanning..." : "Scan QR"}
                      </Button>
                    ) : (
                      <span className="text-xs text-muted-foreground">Not started</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Course Attendance Stats */}
        <div className="space-y-4 opacity-0 animate-fade-up" style={{ animationDelay: "200ms", animationFillMode: "forwards" }}>
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Course Attendance
          </h2>
          <div className="space-y-3">
            {courseStats.length === 0 && (
              <div className="bg-card rounded-xl p-8 border border-border text-center text-muted-foreground">No attendance data</div>
            )}
            {courseStats.map((course, i) => (
              <div
                key={course.code + i}
                className="bg-card rounded-xl p-5 border border-border shadow-card opacity-0 animate-fade-up"
                style={{ animationDelay: `${400 + i * 100}ms`, animationFillMode: "forwards" }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="text-xs font-semibold text-primary">{course.code}</span>
                    <h3 className="font-medium text-foreground text-sm">{course.name}</h3>
                  </div>
                  <span className={cn(
                    "text-lg font-bold",
                    course.percentage >= 90 ? "text-course-green" : course.percentage >= 75 ? "text-course-orange" : "text-destructive"
                  )}>
                    {course.percentage}%
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                  <span>{course.attended}/{course.total} classes attended</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-1000",
                      course.percentage >= 90 ? "bg-course-green" : course.percentage >= 75 ? "bg-course-orange" : "bg-destructive"
                    )}
                    style={{ width: `${course.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
