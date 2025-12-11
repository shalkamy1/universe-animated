import { cn } from "@/lib/utils";

interface Grade {
  id: string;
  course: string;
  assignment: string;
  grade: number;
  color: string;
}

const grades: Grade[] = [
  { id: "1", course: "CS401", assignment: "Project 2", grade: 95, color: "bg-course-green" },
  { id: "2", course: "MATH301", assignment: "Midterm Exam", grade: 88, color: "bg-course-blue" },
  { id: "3", course: "ENG201", assignment: "Essay 1", grade: 92, color: "bg-course-green" },
];

const RecentGrades = () => {
  return (
    <div className="bg-card rounded-xl p-6 shadow-card opacity-0 animate-fade-up" style={{ animationDelay: "500ms", animationFillMode: "forwards" }}>
      <h2 className="text-lg font-semibold text-foreground mb-4">Recent Grades</h2>
      <div className="space-y-4">
        {grades.map((grade, index) => (
          <div
            key={grade.id}
            className="opacity-0 animate-fade-up"
            style={{ animationDelay: `${600 + index * 100}ms`, animationFillMode: "forwards" }}
          >
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="font-medium text-foreground">{grade.course}</p>
                <p className="text-sm text-muted-foreground">{grade.assignment}</p>
              </div>
              <span className={cn(
                "text-lg font-bold",
                grade.grade >= 90 ? "text-course-green" : grade.grade >= 80 ? "text-course-blue" : "text-course-orange"
              )}>
                {grade.grade}%
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className={cn("h-full rounded-full transition-all duration-1000", grade.color)}
                style={{ 
                  width: `${grade.grade}%`,
                  animation: `grow-width 1s ease-out ${700 + index * 100}ms forwards`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes grow-width {
          from { width: 0%; }
        }
      `}</style>
    </div>
  );
};

export default RecentGrades;
