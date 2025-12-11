import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Printer, Download, Bell, Video } from "lucide-react";
import { cn } from "@/lib/utils";

interface ClassBlock {
  id: string;
  code: string;
  name: string;
  professor: string;
  time: string;
  location: string;
  color: string;
  day: number;
  startHour: number;
  duration: number;
}

const classBlocks: ClassBlock[] = [
  { id: "1", code: "CS401", name: "Advanced Web Development", professor: "Dr. Sarah Johnson", time: "09:00 - 10:30", location: "Tech Building 201", color: "bg-course-orange", day: 1, startHour: 9, duration: 1.5 },
  { id: "2", code: "CS402", name: "Database Systems", professor: "Dr. Emily Rodriguez", time: "11:00 - 12:30", location: "Tech Building 305", color: "bg-course-green", day: 1, startHour: 11, duration: 1.5 },
  { id: "3", code: "CS401L", name: "Web Dev Lab", professor: "TA. Michael Chen", time: "14:00 - 16:00", location: "Computer Lab 101", color: "bg-course-teal", day: 1, startHour: 14, duration: 2 },
  { id: "4", code: "MATH301", name: "Linear Algebra", professor: "Prof. Michael Chen", time: "08:00 - 09:30", location: "Math Hall 105", color: "bg-course-teal", day: 2, startHour: 8, duration: 1.5 },
  { id: "5", code: "CS403", name: "Machine Learning", professor: "Dr. James Wilson", time: "10:00 - 11:30", location: "AI Lab 401", color: "bg-course-purple", day: 2, startHour: 10, duration: 1.5 },
  { id: "6", code: "CS401", name: "Advanced Web Development", professor: "Dr. Sarah Johnson", time: "09:00 - 10:30", location: "Tech Building 201", color: "bg-course-orange", day: 3, startHour: 9, duration: 1.5 },
  { id: "7", code: "LUNCH", name: "Lunch Break", professor: "", time: "13:00 - 14:00", location: "", color: "bg-course-gray", day: 3, startHour: 13, duration: 1 },
  { id: "8", code: "ENG201", name: "Technical Writing", professor: "Prof. Lisa Anderson", time: "15:00 - 16:30", location: "Humanities 210", color: "bg-course-magenta", day: 3, startHour: 15, duration: 1.5 },
  { id: "9", code: "MATH301", name: "Linear Algebra", professor: "Prof. Michael Chen", time: "08:00 - 09:30", location: "Math Hall 105", color: "bg-course-teal", day: 4, startHour: 8, duration: 1.5 },
  { id: "10", code: "CS402L", name: "Database Lab", professor: "TA. Alex Johnson", time: "11:00 - 13:00", location: "Computer Lab 102", color: "bg-course-blue", day: 4, startHour: 11, duration: 2 },
  { id: "11", code: "CS401", name: "Advanced Web Development", professor: "Dr. Sarah Johnson", time: "09:00 - 10:30", location: "Tech Building 201", color: "bg-course-magenta", day: 5, startHour: 9, duration: 1.5 },
  { id: "12", code: "CS402", name: "Database Systems", professor: "Dr. Emily Rodriguez", time: "11:00 - 12:30", location: "Tech Building 305", color: "bg-course-green", day: 5, startHour: 11, duration: 1.5 },
];

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const dayDates = ["Jan 15", "Jan 16", "Jan 17", "Jan 18", "Jan 19"];
const hours = Array.from({ length: 11 }, (_, i) => 8 + i);

const Timetable = () => {
  const [view, setView] = useState<"week" | "day">("week");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between opacity-0 animate-fade-up" style={{ animationFillMode: "forwards" }}>
        <div>
          <h1 className="text-2xl font-bold text-foreground italic">My Timetable</h1>
          <p className="text-muted-foreground">Spring Semester 2024 - Week 1</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon">
            <Printer className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="hero" className="gap-2">
            <Bell className="h-4 w-4" />
            Set Reminders
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 opacity-0 animate-fade-up" style={{ animationDelay: "100ms", animationFillMode: "forwards" }}>
        {[
          { icon: "📚", label: "Total Classes", value: 11, color: "text-primary" },
          { icon: "📖", label: "Lectures", value: 8, color: "text-course-blue" },
          { icon: "💻", label: "Labs", value: 2, color: "text-course-green" },
          { icon: "👥", label: "Tutorials", value: 1, color: "text-course-purple" },
        ].map((stat, i) => (
          <div key={stat.label} className="stat-card flex items-center gap-4">
            <span className="text-2xl">{stat.icon}</span>
            <div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className={cn("text-2xl font-bold", stat.color)}>{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between opacity-0 animate-fade-up" style={{ animationDelay: "200ms", animationFillMode: "forwards" }}>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium px-4">📅 Jan 15 - Jan 19, 2024</span>
          <Button variant="outline" size="icon">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex gap-2">
          <Button
            variant={view === "week" ? "default" : "outline"}
            size="sm"
            onClick={() => setView("week")}
          >
            Week View
          </Button>
          <Button
            variant={view === "day" ? "default" : "outline"}
            size="sm"
            onClick={() => setView("day")}
          >
            Day View
          </Button>
        </div>
      </div>

      {/* Timetable Grid */}
      <div className="bg-card rounded-xl border border-border overflow-hidden opacity-0 animate-fade-up" style={{ animationDelay: "300ms", animationFillMode: "forwards" }}>
        <div className="grid grid-cols-[80px_repeat(5,1fr)]">
          {/* Header Row */}
          <div className="bg-muted p-4 border-b border-border font-medium text-muted-foreground text-sm">
            Time
          </div>
          {days.map((day, i) => (
            <div key={day} className="bg-muted p-4 border-b border-l border-border text-center">
              <p className="font-semibold text-foreground">{day}</p>
              <p className="text-sm text-muted-foreground">{dayDates[i]}</p>
            </div>
          ))}

          {/* Time Rows */}
          {hours.map((hour) => (
            <div key={hour} className="contents">
              <div className="p-4 border-b border-border text-sm text-muted-foreground">
                {hour.toString().padStart(2, "0")}:00
              </div>
              {days.map((_, dayIndex) => {
                const classBlock = classBlocks.find(
                  (c) => c.day === dayIndex + 1 && c.startHour === hour
                );
                return (
                  <div
                    key={`${hour}-${dayIndex}`}
                    className="border-b border-l border-border relative min-h-[80px]"
                  >
                    {classBlock && (
                      <div
                        className={cn(
                          "absolute inset-1 rounded-xl p-3 text-white opacity-0 animate-scale-in",
                          classBlock.color
                        )}
                        style={{
                          height: `calc(${classBlock.duration * 100}% - 8px)`,
                          animationDelay: `${400 + Math.random() * 300}ms`,
                          animationFillMode: "forwards",
                        }}
                      >
                        <div className="flex items-start justify-between">
                          <span className="text-xs font-medium bg-white/20 px-2 py-0.5 rounded">
                            {classBlock.code}
                          </span>
                          <Video className="h-4 w-4 opacity-80" />
                        </div>
                        <h3 className="font-semibold text-sm mt-2 line-clamp-1">
                          {classBlock.name}
                        </h3>
                        {classBlock.professor && (
                          <p className="text-xs opacity-90 mt-1">
                            👤 {classBlock.professor}
                          </p>
                        )}
                        <p className="text-xs opacity-80 mt-1">
                          🕐 {classBlock.time}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Timetable;
