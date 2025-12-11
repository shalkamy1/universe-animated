import { Button } from "@/components/ui/button";
import { FileText, BarChart2, BookPlus, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

const QuickActions = () => {
  return (
    <div className="bg-card rounded-xl p-6 shadow-card opacity-0 animate-fade-up" style={{ animationDelay: "600ms", animationFillMode: "forwards" }}>
      <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
      <div className="space-y-3">
        <Button variant="quick" className="w-full justify-start gap-3">
          <FileText className="h-4 w-4 text-muted-foreground" />
          View All Assignments
        </Button>
        <Button variant="quick" className="w-full justify-start gap-3">
          <BarChart2 className="h-4 w-4 text-muted-foreground" />
          Check My Grades
        </Button>
        <Link to="/courses">
          <Button variant="quick" className="w-full justify-start gap-3">
            <BookPlus className="h-4 w-4 text-muted-foreground" />
            Add/Drop Courses
          </Button>
        </Link>
        <Link to="/timetable">
          <Button variant="hero" className="w-full gap-2 mt-2">
            <Calendar className="h-4 w-4" />
            View Timetable
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default QuickActions;
