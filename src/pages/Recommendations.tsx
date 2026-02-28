import { useState } from "react";
import { Lightbulb, TrendingUp, Target, AlertTriangle, CheckCircle, BookOpen, Zap, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Scenario = "improve_gpa" | "finish_courses";

const recommendationsData: Record<Scenario, Array<{
  code: string;
  name: string;
  credits: number;
  reason: string;
  tag: string;
  confidence: number;
}>> = {
  improve_gpa: [
    { code: "ENG201", name: "Technical Writing", credits: 2, reason: "High GPA potential — 92% students score B+ or above", tag: "Easy A", confidence: 94 },
    { code: "HUM101", name: "Introduction to Philosophy", credits: 3, reason: "Light workload with high success rate", tag: "Light Load", confidence: 88 },
    { code: "CS310", name: "Software Engineering", credits: 3, reason: "Core requirement with above-average pass rate", tag: "Core + High Pass", confidence: 82 },
    { code: "MATH202", name: "Statistics", credits: 3, reason: "Prerequisite for electives — good grade booster", tag: "GPA Boost", confidence: 79 },
  ],
  finish_courses: [
    { code: "CS450", name: "Operating Systems", credits: 3, reason: "Core requirement — needed for graduation", tag: "Core Req", confidence: 90 },
    { code: "CS460", name: "Computer Networks", credits: 3, reason: "Core requirement — only offered in Spring", tag: "Time Sensitive", confidence: 88 },
    { code: "MATH401", name: "Numerical Analysis", credits: 3, reason: "Last math requirement remaining", tag: "Final Math", confidence: 85 },
    { code: "CS499", name: "Senior Project", credits: 6, reason: "Capstone requirement — register early", tag: "Capstone", confidence: 95 },
  ],
};

const alerts = [
  { type: "warning", message: "Your GPA dropped from 2.8 to 2.5 last semester. Consider lighter course loads.", icon: AlertTriangle },
  { type: "info", message: "You have 15 credits remaining to graduate. Expected graduation: Spring 2025.", icon: Target },
  { type: "success", message: "CS401 midterm score above class average — keep it up!", icon: CheckCircle },
];

const Recommendations = () => {
  const [scenario, setScenario] = useState<Scenario>("improve_gpa");

  const recommendations = recommendationsData[scenario];

  return (
    <div className="space-y-6">
      <div className="opacity-0 animate-fade-up" style={{ animationFillMode: "forwards" }}>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Lightbulb className="h-6 w-6 text-course-orange" />
          Course Recommendations
        </h1>
        <p className="text-muted-foreground">AI-powered course suggestions based on your academic profile</p>
      </div>

      {/* Scenario Selector */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 opacity-0 animate-fade-up" style={{ animationDelay: "100ms", animationFillMode: "forwards" }}>
        <button
          onClick={() => setScenario("improve_gpa")}
          className={cn(
            "p-5 rounded-xl border-2 text-left transition-all",
            scenario === "improve_gpa"
              ? "border-primary bg-primary/5"
              : "border-border bg-card hover:border-primary/30"
          )}
        >
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className={cn("h-6 w-6", scenario === "improve_gpa" ? "text-primary" : "text-muted-foreground")} />
            <h3 className="font-semibold text-foreground">Improve GPA</h3>
          </div>
          <p className="text-sm text-muted-foreground">Prioritize courses with higher success probability and better grade impact</p>
        </button>
        <button
          onClick={() => setScenario("finish_courses")}
          className={cn(
            "p-5 rounded-xl border-2 text-left transition-all",
            scenario === "finish_courses"
              ? "border-primary bg-primary/5"
              : "border-border bg-card hover:border-primary/30"
          )}
        >
          <div className="flex items-center gap-3 mb-2">
            <Target className={cn("h-6 w-6", scenario === "finish_courses" ? "text-primary" : "text-muted-foreground")} />
            <h3 className="font-semibold text-foreground">Finish Remaining Courses</h3>
          </div>
          <p className="text-sm text-muted-foreground">Prioritize pending or required courses to graduate faster</p>
        </button>
      </div>

      {/* Recommendations List */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground opacity-0 animate-fade-up" style={{ animationDelay: "200ms", animationFillMode: "forwards" }}>
          Recommended Courses for Next Semester
        </h2>
        {recommendations.map((course, i) => (
          <div
            key={course.code}
            className="bg-card rounded-xl p-5 border border-border shadow-card opacity-0 animate-fade-up transition-all hover:shadow-lg"
            style={{ animationDelay: `${300 + i * 100}ms`, animationFillMode: "forwards" }}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-semibold px-2 py-1 rounded bg-primary/10 text-primary">{course.code}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-course-orange/10 text-course-orange flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    {course.tag}
                  </span>
                  <span className="text-xs text-muted-foreground">{course.credits} credits</span>
                </div>
                <h3 className="font-semibold text-foreground">{course.name}</h3>
                <div className="flex items-start gap-2 mt-2">
                  <Zap className="h-4 w-4 text-course-orange mt-0.5 shrink-0" />
                  <p className="text-sm text-muted-foreground">{course.reason}</p>
                </div>
              </div>
              <div className="text-right ml-4">
                <div className="text-2xl font-bold text-primary">{course.confidence}%</div>
                <p className="text-xs text-muted-foreground">match</p>
              </div>
            </div>
            <div className="mt-3 h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-1000"
                style={{ width: `${course.confidence}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Academic Alerts */}
      <div className="space-y-3 opacity-0 animate-fade-up" style={{ animationDelay: "700ms", animationFillMode: "forwards" }}>
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-course-orange" />
          Academic Alerts
        </h2>
        {alerts.map((alert, i) => (
          <div
            key={i}
            className={cn(
              "rounded-xl p-4 flex items-start gap-3 border opacity-0 animate-fade-up",
              alert.type === "warning" && "bg-course-orange/5 border-course-orange/20",
              alert.type === "info" && "bg-primary/5 border-primary/20",
              alert.type === "success" && "bg-course-green/5 border-course-green/20"
            )}
            style={{ animationDelay: `${800 + i * 100}ms`, animationFillMode: "forwards" }}
          >
            <alert.icon className={cn(
              "h-5 w-5 mt-0.5 shrink-0",
              alert.type === "warning" && "text-course-orange",
              alert.type === "info" && "text-primary",
              alert.type === "success" && "text-course-green"
            )} />
            <p className="text-sm text-foreground">{alert.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recommendations;
