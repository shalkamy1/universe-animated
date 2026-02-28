import { useState } from "react";
import { Upload, BarChart3, Users, FileText, Plus, TrendingUp, TrendingDown, Minus } from "lucide-react";
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

const courses = [
  { id: "cs401", code: "CS401", name: "Advanced Web Development", students: 25 },
  { id: "cs402", code: "CS402", name: "Database Systems", students: 22 },
];

const gradeComponents = [
  { name: "Quizzes", weight: 15 },
  { name: "Assignments", weight: 20 },
  { name: "Midterm", weight: 25 },
  { name: "Participation", weight: 10 },
  { name: "Final", weight: 30 },
];

const students = [
  { id: "1", name: "Ahmed Hassan", quizzes: 88, assignments: 92, midterm: 78, participation: 95, final: null, total: null },
  { id: "2", name: "Sara Ali", quizzes: 95, assignments: 90, midterm: 85, participation: 90, final: null, total: null },
  { id: "3", name: "Mohammed Khalid", quizzes: 72, assignments: 68, midterm: 65, participation: 80, final: null, total: null },
  { id: "4", name: "Fatima Nour", quizzes: 90, assignments: 95, midterm: 92, participation: 88, final: null, total: null },
  { id: "5", name: "Omar Youssef", quizzes: 60, assignments: 55, midterm: 42, participation: 70, final: null, total: null },
];

const materials = [
  { name: "Lecture 1 - Introduction.pdf", type: "Slides", date: "2024-03-01", size: "2.4 MB" },
  { name: "Assignment 1 - HTML Basics.pdf", type: "Assignment", date: "2024-03-05", size: "1.1 MB" },
  { name: "Quiz 1 Solutions.pdf", type: "Notes", date: "2024-03-08", size: "0.8 MB" },
];

const FacultyPortal = () => {
  const [activeTab, setActiveTab] = useState<"grades" | "materials" | "analytics">("grades");
  const [selectedCourse, setSelectedCourse] = useState(courses[0].id);

  const analytics = {
    quizzes: { highest: 95, lowest: 60, average: 81 },
    assignments: { highest: 95, lowest: 55, average: 80 },
    midterm: { highest: 92, lowest: 42, average: 72.4 },
    participation: { highest: 95, lowest: 70, average: 84.6 },
  };

  const handleUpload = () => {
    toast.success("File uploaded successfully!");
  };

  const tabs = [
    { key: "grades" as const, icon: Users, label: "Grade Management" },
    { key: "materials" as const, icon: FileText, label: "Course Materials" },
    { key: "analytics" as const, icon: BarChart3, label: "Grade Analytics" },
  ];

  return (
    <div className="space-y-6">
      <div className="opacity-0 animate-fade-up" style={{ animationFillMode: "forwards" }}>
        <h1 className="text-2xl font-bold text-foreground">Faculty Portal</h1>
        <p className="text-muted-foreground">Manage courses, grades, and materials</p>
      </div>

      {/* Course Selector */}
      <div className="flex items-center gap-4 opacity-0 animate-fade-up" style={{ animationDelay: "100ms", animationFillMode: "forwards" }}>
        <Select value={selectedCourse} onValueChange={setSelectedCourse}>
          <SelectTrigger className="w-72">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {courses.map((c) => (
              <SelectItem key={c.id} value={c.id}>{c.code} - {c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground">{courses.find(c => c.id === selectedCourse)?.students} students</span>
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
              <div className="flex gap-2">
                {gradeComponents.map((comp) => (
                  <span key={comp.name} className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground">
                    {comp.name} ({comp.weight}%)
                  </span>
                ))}
              </div>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-3 text-muted-foreground font-medium">Student</th>
                  {gradeComponents.map((comp) => (
                    <th key={comp.name} className="text-center p-3 text-muted-foreground font-medium">{comp.name}</th>
                  ))}
                  <th className="text-center p-3 text-muted-foreground font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => {
                  const total = (
                    (student.quizzes * 0.15) +
                    (student.assignments * 0.20) +
                    (student.midterm * 0.25) +
                    (student.participation * 0.10)
                  ).toFixed(1);
                  return (
                    <tr key={student.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                      <td className="p-3 font-medium text-foreground">{student.name}</td>
                      <td className="p-3 text-center">
                        <Input type="number" defaultValue={student.quizzes} className="w-16 h-8 text-center mx-auto" />
                      </td>
                      <td className="p-3 text-center">
                        <Input type="number" defaultValue={student.assignments} className="w-16 h-8 text-center mx-auto" />
                      </td>
                      <td className="p-3 text-center">
                        <Input type="number" defaultValue={student.midterm} className="w-16 h-8 text-center mx-auto" />
                      </td>
                      <td className="p-3 text-center">
                        <Input type="number" defaultValue={student.participation} className="w-16 h-8 text-center mx-auto" />
                      </td>
                      <td className="p-3 text-center text-muted-foreground">—</td>
                      <td className="p-3 text-center font-bold text-foreground">{total}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="flex justify-end mt-4">
            <Button variant="hero">Save All Grades</Button>
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
                  <th className="text-left p-3 text-muted-foreground font-medium">File Name</th>
                  <th className="text-left p-3 text-muted-foreground font-medium">Type</th>
                  <th className="text-left p-3 text-muted-foreground font-medium">Date</th>
                  <th className="text-left p-3 text-muted-foreground font-medium">Size</th>
                </tr>
              </thead>
              <tbody>
                {materials.map((mat, i) => (
                  <tr key={i} className="border-t border-border">
                    <td className="p-3 font-medium text-foreground flex items-center gap-2">
                      <FileText className="h-4 w-4 text-primary" />
                      {mat.name}
                    </td>
                    <td className="p-3"><span className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary">{mat.type}</span></td>
                    <td className="p-3 text-muted-foreground">{mat.date}</td>
                    <td className="p-3 text-muted-foreground">{mat.size}</td>
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
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(analytics).map(([key, values], i) => (
              <div
                key={key}
                className="bg-card rounded-xl p-5 border border-border shadow-card opacity-0 animate-fade-up"
                style={{ animationDelay: `${300 + i * 100}ms`, animationFillMode: "forwards" }}
              >
                <h4 className="text-sm font-medium text-muted-foreground capitalize mb-3">{key}</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground flex items-center gap-1"><TrendingUp className="h-3 w-3 text-course-green" />Highest</span>
                    <span className="font-bold text-course-green">{values.highest}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground flex items-center gap-1"><Minus className="h-3 w-3" />Average</span>
                    <span className="font-bold text-foreground">{values.average}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground flex items-center gap-1"><TrendingDown className="h-3 w-3 text-destructive" />Lowest</span>
                    <span className="font-bold text-destructive">{values.lowest}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Student Performance Overview */}
          <div className="bg-card rounded-xl border border-border p-5">
            <h3 className="font-semibold text-foreground mb-4">Student Performance Overview</h3>
            <div className="space-y-3">
              {students.map((student) => {
                const avg = ((student.quizzes + student.assignments + student.midterm + student.participation) / 4);
                return (
                  <div key={student.id} className="flex items-center gap-4">
                    <span className="text-sm font-medium text-foreground w-40 truncate">{student.name}</span>
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-1000",
                          avg >= 85 ? "bg-course-green" : avg >= 70 ? "bg-course-orange" : "bg-destructive"
                        )}
                        style={{ width: `${avg}%` }}
                      />
                    </div>
                    <span className={cn(
                      "text-sm font-bold w-12 text-right",
                      avg >= 85 ? "text-course-green" : avg >= 70 ? "text-course-orange" : "text-destructive"
                    )}>
                      {avg.toFixed(0)}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacultyPortal;
