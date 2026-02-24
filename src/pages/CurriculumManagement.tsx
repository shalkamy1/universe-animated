import { BookOpen, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const stats = [
  { label: "Overall Progress", value: "63%", sub: "", color: "text-primary", hasProgress: true, progress: 63 },
  { label: "Credits Completed", value: "75", sub: "of 120 required", color: "text-foreground", hasProgress: false },
  { label: "Current GPA", value: "3.8", sub: "Required: 2.5", color: "text-foreground", hasProgress: false },
  { label: "Remaining", value: "45", sub: "credits to graduate", color: "text-foreground", hasProgress: false },
];

const years = [
  {
    title: "First Year",
    semesters: [
      {
        name: "Fall 2021",
        courses: [
          { code: "CS101", credits: 3, name: "Introduction to Programming", grade: "A" },
          { code: "MATH101", credits: 4, name: "Calculus I", grade: "A-" },
          { code: "ENG101", credits: 3, name: "English Composition", grade: "B+" },
        ],
      },
      {
        name: "Spring 2022",
        courses: [
          { code: "CS102", credits: 3, name: "Data Structures", grade: "A" },
          { code: "MATH102", credits: 4, name: "Calculus II", grade: "B+" },
          { code: "ENG102", credits: 3, name: "Technical Writing", grade: "A-" },
        ],
      },
    ],
  },
  {
    title: "Second Year",
    semesters: [
      {
        name: "Fall 2022",
        courses: [
          { code: "CS201", credits: 3, name: "Algorithms", grade: "A" },
          { code: "CS202", credits: 3, name: "Database Systems", grade: "A-" },
          { code: "MATH201", credits: 3, name: "Linear Algebra", grade: "B+" },
        ],
      },
      {
        name: "Spring 2023",
        courses: [
          { code: "CS203", credits: 3, name: "Operating Systems", grade: "A" },
          { code: "CS204", credits: 3, name: "Computer Networks", grade: "B+" },
          { code: "STAT201", credits: 3, name: "Probability & Statistics", grade: "A-" },
        ],
      },
    ],
  },
];

const gradeColor = (grade: string) => {
  if (grade.startsWith("A")) return "bg-course-green/10 text-course-green border-course-green/30";
  if (grade.startsWith("B")) return "bg-primary/10 text-primary border-primary/30";
  return "bg-course-orange/10 text-course-orange border-course-orange/30";
};

const CurriculumManagement = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="opacity-0 animate-fade-up flex items-center gap-4" style={{ animationFillMode: "forwards" }}>
        <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center">
          <BookOpen className="h-7 w-7 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Curriculum Management</h1>
          <p className="text-muted-foreground">Bachelor of Science in Computer Science</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card
            key={stat.label}
            className={`opacity-0 animate-fade-up ${i === 0 ? "border-primary/30 bg-gradient-to-br from-primary/5 to-transparent" : ""}`}
            style={{ animationFillMode: "forwards", animationDelay: `${i * 100}ms` }}
          >
            <CardContent className="p-5">
              <p className={`text-sm font-medium ${i === 0 ? "text-primary" : "text-muted-foreground"}`}>{stat.label}</p>
              <p className={`text-3xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
              {stat.sub && <p className="text-xs text-muted-foreground mt-1">{stat.sub}</p>}
              {stat.hasProgress && (
                <Progress value={stat.progress} className="mt-3 h-2" />
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Years */}
      {years.map((year, yi) => (
        <Card
          key={year.title}
          className="opacity-0 animate-fade-up"
          style={{ animationFillMode: "forwards", animationDelay: `${(yi + 1) * 200}ms` }}
        >
          <CardContent className="p-6">
            <h2 className="text-xl font-bold text-foreground mb-4">{year.title}</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {year.semesters.map((semester) => (
                <div key={semester.name} className="border border-border rounded-xl p-4">
                  <h3 className="font-semibold text-foreground mb-4">{semester.name}</h3>
                  <div className="space-y-3">
                    {semester.courses.map((course) => (
                      <div key={course.code} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className="h-5 w-5 text-course-green" />
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              {course.code} <span className="text-muted-foreground font-normal">{course.credits} credits</span>
                            </p>
                            <p className="text-xs text-muted-foreground">{course.name}</p>
                          </div>
                        </div>
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg border ${gradeColor(course.grade)}`}>
                          {course.grade}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CurriculumManagement;
