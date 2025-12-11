import { cn } from "@/lib/utils";

interface Assignment {
  id: string;
  name: string;
  course: string;
  dueDate: string;
  priority: "high" | "medium" | "low";
}

const assignments: Assignment[] = [
  {
    id: "1",
    name: "Web Development Project 3",
    course: "CS401",
    dueDate: "Dec 15",
    priority: "high",
  },
  {
    id: "2",
    name: "Linear Algebra Problem Set",
    course: "MATH301",
    dueDate: "Dec 18",
    priority: "medium",
  },
  {
    id: "3",
    name: "Technical Writing Essay",
    course: "ENG201",
    dueDate: "Dec 20",
    priority: "low",
  },
];

const priorityColors = {
  high: "text-primary border-l-primary",
  medium: "text-course-orange border-l-course-orange",
  low: "text-course-green border-l-course-green",
};

const priorityLabels = {
  high: "High Priority",
  medium: "Medium Priority",
  low: "Low Priority",
};

const PendingAssignments = () => {
  return (
    <div className="bg-card rounded-xl p-6 shadow-card opacity-0 animate-fade-up" style={{ animationDelay: "400ms", animationFillMode: "forwards" }}>
      <h2 className="text-lg font-semibold text-foreground mb-4">Pending Assignments</h2>
      <div className="space-y-4">
        {assignments.map((assignment, index) => (
          <div
            key={assignment.id}
            className={cn(
              "border-l-4 pl-4 py-2 opacity-0 animate-fade-up",
              priorityColors[assignment.priority]
            )}
            style={{ animationDelay: `${500 + index * 100}ms`, animationFillMode: "forwards" }}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium text-foreground">{assignment.name}</h3>
                <p className="text-sm text-muted-foreground mt-0.5">{assignment.course}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">Due {assignment.dueDate}</p>
                <p className={cn("text-xs mt-0.5", priorityColors[assignment.priority])}>
                  {priorityLabels[assignment.priority]}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PendingAssignments;
