import { useState } from "react";
import { QrCode, Camera, CheckCircle, XCircle, Clock, Calendar, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const todayLectures = [
  { id: "1", code: "CS401", name: "Advanced Web Development", time: "10:00 - 11:30 AM", room: "Tech 201", status: "active", qrAvailable: true },
  { id: "2", code: "MATH301", name: "Linear Algebra", time: "2:00 - 3:30 PM", room: "Math 105", status: "upcoming", qrAvailable: false },
  { id: "3", code: "ENG201", name: "Technical Writing", time: "3:00 - 4:00 PM", room: "Hum 210", status: "upcoming", qrAvailable: false },
];

const attendanceHistory = [
  { date: "2024-03-10", course: "CS401", status: "present" },
  { date: "2024-03-10", course: "MATH301", status: "present" },
  { date: "2024-03-09", course: "CS401", status: "present" },
  { date: "2024-03-09", course: "ENG201", status: "absent" },
  { date: "2024-03-08", course: "MATH301", status: "present" },
  { date: "2024-03-08", course: "CS401", status: "late" },
  { date: "2024-03-07", course: "ENG201", status: "present" },
  { date: "2024-03-07", course: "MATH301", status: "present" },
];

const courseStats = [
  { code: "CS401", name: "Advanced Web Dev", attended: 22, total: 24, percentage: 92 },
  { code: "MATH301", name: "Linear Algebra", attended: 20, total: 24, percentage: 83 },
  { code: "ENG201", name: "Technical Writing", attended: 18, total: 22, percentage: 82 },
];

const Attendance = () => {
  const [scanning, setScanning] = useState(false);
  const [scannedLecture, setScannedLecture] = useState<string | null>(null);

  const handleScanQR = (lectureId: string) => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      setScannedLecture(lectureId);
      toast.success("Attendance recorded successfully!");
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="opacity-0 animate-fade-up" style={{ animationFillMode: "forwards" }}>
        <h1 className="text-2xl font-bold text-foreground">Attendance Management</h1>
        <p className="text-muted-foreground">QR-based attendance tracking system</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 opacity-0 animate-fade-up" style={{ animationDelay: "100ms", animationFillMode: "forwards" }}>
        {[
          { icon: CheckCircle, label: "Overall Attendance", value: "86%", color: "text-course-green" },
          { icon: Calendar, label: "Classes Today", value: todayLectures.length.toString(), color: "text-primary" },
          { icon: Clock, label: "Next Class", value: "2:00 PM", color: "text-course-orange" },
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
                    {scannedLecture === lecture.id ? (
                      <div className="flex items-center gap-1 text-course-green">
                        <CheckCircle className="h-5 w-5" />
                        <span className="text-xs font-medium">Recorded</span>
                      </div>
                    ) : lecture.qrAvailable ? (
                      <Button
                        size="sm"
                        onClick={() => handleScanQR(lecture.id)}
                        disabled={scanning}
                        className="gap-1"
                      >
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
            {courseStats.map((course, i) => (
              <div
                key={course.code}
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

          {/* Recent History */}
          <h2 className="text-lg font-semibold text-foreground mt-6">Recent History</h2>
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-3 text-muted-foreground font-medium">Date</th>
                  <th className="text-left p-3 text-muted-foreground font-medium">Course</th>
                  <th className="text-left p-3 text-muted-foreground font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {attendanceHistory.slice(0, 6).map((record, i) => (
                  <tr key={i} className="border-t border-border">
                    <td className="p-3 text-foreground">{record.date}</td>
                    <td className="p-3 font-medium text-foreground">{record.course}</td>
                    <td className="p-3">
                      <span className={cn(
                        "text-xs px-2 py-0.5 rounded-full",
                        record.status === "present" && "bg-course-green/10 text-course-green",
                        record.status === "absent" && "bg-destructive/10 text-destructive",
                        record.status === "late" && "bg-course-orange/10 text-course-orange"
                      )}>
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
