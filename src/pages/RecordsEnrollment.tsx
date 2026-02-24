import { ArrowLeft, Building2, GraduationCap, Calendar, Award, BookOpen, Download, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const enrolledCourses = [
  { name: "Advanced Software Engineering", code: "CS402", credits: 3, type: "CORE", status: "Registered" },
  { name: "Database Systems II", code: "CS405", credits: 3, type: "CORE", status: "Registered" },
  { name: "Discrete Mathematics", code: "MAT301", credits: 4, type: "REQUIRED", status: "Registered" },
  { name: "Professional Ethics", code: "HSS201", credits: 2, type: "ELECTIVE", status: "Registered" },
];

const milestones = [
  { label: "First Year Completed", date: "June 2022", done: true },
  { label: "Second Year Completed", date: "June 2023", done: true },
  { label: "Third Year Completed", date: "June 2024", done: true },
  { label: "Graduation", date: "Expected June 2025", done: false },
];

const typeColor = (type: string) => {
  if (type === "CORE") return "bg-primary text-primary-foreground";
  if (type === "REQUIRED") return "bg-foreground text-background";
  return "bg-muted text-muted-foreground";
};

const RecordsEnrollment = () => {
  const navigate = useNavigate();

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
            <h2 className="text-xl font-bold text-foreground">Rawda Ayman</h2>
            <p className="text-sm text-primary font-medium">ID: 224141</p>

            <div className="w-full mt-6 space-y-4 text-left">
              {[
                { icon: Building2, label: "FACULTY", value: "Engineering & Technology" },
                { icon: GraduationCap, label: "PROGRAM", value: "B.Sc. in Computer Science" },
                { icon: Calendar, label: "YEAR", value: "4th Year" },
                { icon: Award, label: "GPA", value: "3.8 / 4.0" },
              ].map((item, i) => (
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
                  <h2 className="text-lg font-bold text-foreground">Current Semester Enrollment</h2>
                </div>
                <Button variant="ghost" size="sm" className="text-primary">
                  <Download className="h-4 w-4 mr-1" /> Download Proof
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
                    </tr>
                  </thead>
                  <tbody>
                    {enrolledCourses.map((course, i) => (
                      <tr
                        key={course.code}
                        className="border-b border-border/50 opacity-0 animate-fade-up"
                        style={{ animationFillMode: "forwards", animationDelay: `${300 + i * 80}ms` }}
                      >
                        <td className="py-3">
                          <p className="text-sm font-medium text-foreground">{course.name}</p>
                          <p className="text-xs text-muted-foreground">{course.code}</p>
                        </td>
                        <td className="text-center text-sm text-foreground">{course.credits}</td>
                        <td className="text-center">
                          <Badge className={`text-[10px] ${typeColor(course.type)}`}>{course.type}</Badge>
                        </td>
                        <td className="text-center">
                          <span className="text-xs font-medium text-course-green flex items-center justify-center gap-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-course-green" />
                            {course.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Milestones */}
          <Card className="opacity-0 animate-fade-up" style={{ animationFillMode: "forwards", animationDelay: "400ms" }}>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Award className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-bold text-foreground">Academic Milestones</h2>
              </div>
              <div className="flex items-center gap-4">
                {milestones.map((m, i) => (
                  <div key={m.label} className="flex-1 text-center">
                    <div className={`h-10 w-10 mx-auto rounded-full flex items-center justify-center ${m.done ? "bg-course-green/10 text-course-green" : "bg-muted text-muted-foreground"}`}>
                      {m.done ? "✓" : (i + 1)}
                    </div>
                    <p className="text-xs font-medium text-foreground mt-2">{m.label}</p>
                    <p className="text-[10px] text-muted-foreground">{m.date}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RecordsEnrollment;
