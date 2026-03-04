import { useEffect, useState } from "react";
import { ArrowLeft, Building2, GraduationCap, Calendar, Award, BookOpen, Download, User, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { studentCourseService, studentService } from "@/services/api";

const typeColor = (type: string) => {
  if (type === "lecture") return "bg-primary text-primary-foreground";
  if (type === "lab") return "bg-foreground text-background";
  return "bg-muted text-muted-foreground";
};

const RecordsEnrollment = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);
  const [honorStatus, setHonorStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [enrolled, honor] = await Promise.all([
        studentCourseService.list().catch(() => []),
        user?.student?.id
          ? studentService.getHonorStatus(user.student.id).catch(() => null)
          : Promise.resolve(null),
      ]);
      setEnrolledCourses(enrolled);
      setHonorStatus(honor);
    } catch {
      // demo
    } finally {
      setLoading(false);
    }
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
        <div className="flex items-center gap-3 mb-1">
          <button onClick={() => navigate(-1)} className="h-10 w-10 rounded-lg flex items-center justify-center hover:bg-accent transition-colors">
            <ArrowLeft className="h-5 w-5 text-muted-foreground" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Records & Enrollment</h1>
            <p className="text-muted-foreground">Your official academic record and status</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Student Card */}
        <Card className="opacity-0 animate-fade-up" style={{ animationFillMode: "forwards", animationDelay: "100ms" }}>
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="h-24 w-24 rounded-2xl bg-primary flex items-center justify-center mb-4">
              <User className="h-12 w-12 text-primary-foreground" />
            </div>
            <h2 className="text-xl font-bold text-foreground">{user?.name || "Student"}</h2>
            <p className="text-sm text-primary font-medium">ID: {user?.student?.id || user?.id || "—"}</p>

            <div className="w-full mt-6 space-y-4 text-left">
              {[
                { icon: Building2, label: "PROGRAM", value: user?.student?.program || "N/A" },
                { icon: GraduationCap, label: "LEVEL", value: `Level ${user?.student?.level || "—"}` },
                { icon: Calendar, label: "CREDIT HOURS", value: `${user?.student?.credit_hours || "—"} completed` },
                { icon: Award, label: "HONOR STATUS", value: honorStatus?.eligible ? "Eligible" : "N/A" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3 p-3 rounded-lg bg-accent/50">
                  <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    <item.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{item.label}</p>
                    <p className="text-sm font-medium text-foreground">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Enrollment Table */}
          <Card className="opacity-0 animate-fade-up" style={{ animationFillMode: "forwards", animationDelay: "200ms" }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-bold text-foreground">Current Enrollment</h2>
                </div>
                <Button variant="ghost" size="sm" className="text-primary">
                  <Download className="h-4 w-4 mr-1" /> Export
                </Button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left text-xs font-semibold text-primary py-3">COURSE</th>
                      <th className="text-center text-xs font-semibold text-primary py-3">CREDITS</th>
                      <th className="text-center text-xs font-semibold text-primary py-3">TYPE</th>
                      <th className="text-center text-xs font-semibold text-primary py-3">STATUS</th>
                      <th className="text-center text-xs font-semibold text-primary py-3">GRADE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {enrolledCourses.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-muted-foreground">
                          No courses enrolled — connect to the API
                        </td>
                      </tr>
                    )}
                    {enrolledCourses.map((sc: any, i: number) => {
                      const course = sc.teacher_course?.course || {};
                      return (
                        <tr
                          key={sc.id}
                          className="border-b border-border/50 opacity-0 animate-fade-up"
                          style={{ animationFillMode: "forwards", animationDelay: `${300 + i * 80}ms` }}
                        >
                          <td className="py-3">
                            <p className="text-sm font-medium text-foreground">{course.title || "Unknown"}</p>
                            <p className="text-xs text-muted-foreground">{course.code || "N/A"}</p>
                          </td>
                          <td className="text-center text-sm text-foreground">{course.credit_hours || 0}</td>
                          <td className="text-center">
                            <Badge className={`text-[10px] ${typeColor(sc.teacher_course?.session_type || "")}`}>
                              {sc.teacher_course?.session_type || "N/A"}
                            </Badge>
                          </td>
                          <td className="text-center">
                            <span className="text-xs font-medium text-course-green flex items-center justify-center gap-1">
                              <span className="h-1.5 w-1.5 rounded-full bg-course-green" />
                              {sc.status}
                            </span>
                          </td>
                          <td className="text-center text-sm font-bold text-foreground">
                            {sc.letter_grade || "—"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RecordsEnrollment;
