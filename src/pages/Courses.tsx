import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Clock, MapPin, Users, Trash2, Plus, CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Course {
  id: string;
  code: string;
  name: string;
  professor: string;
  credits: number;
  schedule: string;
  location: string;
  enrolled: number;
  capacity: number;
  status: "enrolled" | "available" | "full";
  color: string;
}

const initialEnrolled: Course[] = [
  { id: "1", code: "CS401", name: "Advanced Web Development", professor: "Dr. Sarah Johnson", credits: 3, schedule: "MWF 10:00-11:30 AM", location: "Tech Building 201", enrolled: 25, capacity: 30, status: "enrolled", color: "bg-course-orange" },
  { id: "2", code: "MATH301", name: "Linear Algebra", professor: "Prof. Michael Chen", credits: 4, schedule: "TTh 2:00-3:30 PM", location: "Math Hall 105", enrolled: 28, capacity: 35, status: "enrolled", color: "bg-course-teal" },
];

const availableCourses: Course[] = [
  { id: "3", code: "CS402", name: "Database Systems", professor: "Dr. Emily Rodriguez", credits: 3, schedule: "MWF 1:00-2:30 PM", location: "Tech Building 305", enrolled: 22, capacity: 30, status: "available", color: "bg-course-green" },
  { id: "4", code: "CS403", name: "Machine Learning", professor: "Dr. James Wilson", credits: 3, schedule: "TTh 10:00-11:30 AM", location: "AI Lab 401", enrolled: 30, capacity: 30, status: "full", color: "bg-course-purple" },
  { id: "5", code: "ENG201", name: "Technical Writing", professor: "Prof. Lisa Anderson", credits: 2, schedule: "MW 3:00-4:00 PM", location: "Humanities 210", enrolled: 18, capacity: 25, status: "available", color: "bg-course-magenta" },
];

const Courses = () => {
  const [enrolled, setEnrolled] = useState(initialEnrolled);
  const [available, setAvailable] = useState(availableCourses);
  const [searchQuery, setSearchQuery] = useState("");

  const totalCredits = enrolled.reduce((sum, c) => sum + c.credits, 0);

  const handleEnroll = (course: Course) => {
    if (course.status === "full") {
      toast.error("This course is full");
      return;
    }
    setEnrolled([...enrolled, { ...course, status: "enrolled" }]);
    setAvailable(available.filter((c) => c.id !== course.id));
    toast.success(`Enrolled in ${course.name}`);
  };

  const handleDrop = (course: Course) => {
    setEnrolled(enrolled.filter((c) => c.id !== course.id));
    setAvailable([...available, { ...course, status: "available" }]);
    toast.success(`Dropped ${course.name}`);
  };

  const filteredAvailable = available.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="opacity-0 animate-fade-up" style={{ animationFillMode: "forwards" }}>
        <h1 className="text-2xl font-bold text-foreground">Add/Drop Courses</h1>
        <p className="text-muted-foreground">Manage your course enrollment for Spring 2024</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 opacity-0 animate-fade-up" style={{ animationDelay: "100ms", animationFillMode: "forwards" }}>
        {[
          { icon: "📚", label: "Enrolled Courses", value: enrolled.length, color: "text-primary" },
          { icon: "📊", label: "Total Credits", value: totalCredits, color: "text-course-orange" },
          { icon: "✅", label: "Available Courses", value: available.filter(c => c.status !== "full").length, color: "text-course-green" },
        ].map((stat) => (
          <div key={stat.label} className="stat-card flex items-center gap-4">
            <span className="text-2xl">{stat.icon}</span>
            <div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className={cn("text-2xl font-bold", stat.color)}>{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-2 gap-6">
        {/* My Courses */}
        <div className="space-y-4 opacity-0 animate-fade-up" style={{ animationDelay: "200ms", animationFillMode: "forwards" }}>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">My Courses</h2>
            <span className="text-sm text-primary font-medium">{enrolled.length} enrolled</span>
          </div>
          <div className="space-y-4">
            {enrolled.map((course, index) => (
              <div
                key={course.id}
                className="bg-card rounded-xl p-5 border border-border shadow-card opacity-0 animate-fade-up transition-all hover:shadow-lg"
                style={{ animationDelay: `${300 + index * 100}ms`, animationFillMode: "forwards" }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className={cn("text-xs font-semibold px-2 py-1 rounded text-white", course.color)}>
                      {course.code}
                    </span>
                    <span className="text-xs text-muted-foreground">{course.credits} credits</span>
                  </div>
                  <button
                    onClick={() => handleDrop(course)}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <h3 className="font-semibold text-foreground mt-3">{course.name}</h3>
                <p className="text-sm text-muted-foreground">{course.professor}</p>
                <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {course.schedule}
                  </span>
                </div>
                <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  {course.location}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Available Courses */}
        <div className="space-y-4 opacity-0 animate-fade-up" style={{ animationDelay: "200ms", animationFillMode: "forwards" }}>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Available Courses</h2>
            <button className="text-sm text-primary font-medium flex items-center gap-1">
              <Filter className="h-4 w-4" />
              Filters
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="space-y-4 max-h-[calc(100vh-400px)] overflow-y-auto pr-2">
            {filteredAvailable.map((course, index) => (
              <div
                key={course.id}
                className="bg-card rounded-xl p-5 border border-border shadow-card opacity-0 animate-fade-up transition-all hover:shadow-lg"
                style={{ animationDelay: `${400 + index * 100}ms`, animationFillMode: "forwards" }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className={cn("text-xs font-semibold px-2 py-1 rounded text-white", course.color)}>
                      {course.code}
                    </span>
                    <span className="text-xs text-muted-foreground">{course.credits} credits</span>
                    <span className={cn(
                      "text-xs px-2 py-0.5 rounded-full flex items-center gap-1",
                      course.status === "available" 
                        ? "bg-course-green/10 text-course-green" 
                        : "bg-destructive/10 text-destructive"
                    )}>
                      {course.status === "available" ? (
                        <>
                          <CheckCircle className="h-3 w-3" />
                          Available
                        </>
                      ) : (
                        <>
                          <XCircle className="h-3 w-3" />
                          Full
                        </>
                      )}
                    </span>
                  </div>
                  <button
                    onClick={() => handleEnroll(course)}
                    disabled={course.status === "full"}
                    className={cn(
                      "h-8 w-8 rounded-full flex items-center justify-center transition-all",
                      course.status === "available"
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : "bg-muted text-muted-foreground cursor-not-allowed"
                    )}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <h3 className="font-semibold text-foreground mt-3">{course.name}</h3>
                <p className="text-sm text-muted-foreground">{course.professor}</p>
                <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {course.schedule}
                  </span>
                </div>
                <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  {course.location}
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <Users className="h-3 w-3 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {course.enrolled}/{course.capacity} enrolled
                  </span>
                  <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-500",
                        course.enrolled >= course.capacity ? "bg-destructive" : "bg-course-green"
                      )}
                      style={{ width: `${(course.enrolled / course.capacity) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-border opacity-0 animate-fade-up" style={{ animationDelay: "600ms", animationFillMode: "forwards" }}>
        <Button variant="outline">Cancel Changes</Button>
        <Button variant="hero">Save Enrollment</Button>
      </div>
    </div>
  );
};

export default Courses;
