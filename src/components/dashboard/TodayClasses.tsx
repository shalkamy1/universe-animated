import { MapPin, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface ClassItem {
  id: string;
  name: string;
  location: string;
  time: string;
  status?: "starting-soon" | "ongoing" | "upcoming";
  color: string;
}

const classes: ClassItem[] = [
  {
    id: "1",
    name: "Advanced Web Development",
    location: "Tech Building 201",
    time: "09:00 AM",
    status: "starting-soon",
    color: "bg-course-orange",
  },
  {
    id: "2",
    name: "Database Systems",
    location: "Tech Building 305",
    time: "11:00 AM",
    color: "bg-course-green",
  },
  {
    id: "3",
    name: "Machine Learning",
    location: "AI Lab 401",
    time: "02:00 PM",
    color: "bg-course-purple",
  },
];

const TodayClasses = () => {
  return (
    <div className="bg-card rounded-xl p-6 shadow-card opacity-0 animate-fade-up" style={{ animationDelay: "300ms", animationFillMode: "forwards" }}>
      <h2 className="text-lg font-semibold text-foreground mb-4">Today's Classes</h2>
      <div className="space-y-4">
        {classes.map((cls, index) => (
          <div
            key={cls.id}
            className="flex items-center gap-4 p-3 rounded-xl hover:bg-accent transition-all duration-200 opacity-0 animate-fade-up"
            style={{ animationDelay: `${400 + index * 100}ms`, animationFillMode: "forwards" }}
          >
            <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center", cls.color)}>
              <Clock className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-foreground">{cls.name}</h3>
              <div className="flex items-center gap-1 text-sm text-muted-foreground mt-0.5">
                <MapPin className="h-3 w-3" />
                <span>{cls.location}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium text-foreground">{cls.time}</p>
              {cls.status === "starting-soon" && (
                <span className="text-xs text-primary font-medium animate-pulse">
                  Starting Soon
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodayClasses;
