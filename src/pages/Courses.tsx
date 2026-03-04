import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Clock, MapPin, Users, Trash2, Plus, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { registrationService, studentCourseService } from "@/services/api";

interface Section {
  id: number;
  course: { code: string; title: string; credit_hours: number; description?: string };
  teacher?: { user?: { name: string } };
  schedule: string;
  section: string;
  capacity: number;
  enrolled_count?: number;
  session_type: string;
  eligible?: boolean;
  reason?: string;
}

const Courses = () => {
  const [availableSections, setAvailableSections] = useState<Section[]>([]);
  const [enrolledSections, setEnrolledSections] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [enrollingId, setEnrollingId] = useState<number | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [available, enrolled] = await Promise.all([
        registrationService.getAvailableCourses().catch(() => []),
        studentCourseService.list().catch(() => []),
      ]);
      setAvailableSections(available);
      setEnrolledSections(enrolled);
    } catch {
      // demo mode — keep empty
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (section: Section) => {
    if (section.eligible === false) {
      toast.error(section.reason || "Not eligible for this course");
      return;
    }
    setEnrollingId(section.id);
    try {
      await registrationService.register(section.id);
      toast.success(`Enrolled in ${section.course.code} - ${section.section}`);
      await loadData();
    } catch (err: any) {
      toast.error(err?.message || "Registration failed");
    } finally {
      setEnrollingId(null);
    }
  };

  const handleDrop = async (studentCourseId: number | string) => {
    try {
      await studentCourseService.delete(studentCourseId);
      toast.success("Course dropped successfully");
      await loadData();
    } catch (err: any) {
      toast.error(err?.message || "Failed to drop course");
    }
  };

  const totalCredits = enrolledSections.reduce((sum: number, sc: any) => 
    sum + (sc.teacher_course?.course?.credit_hours || 0), 0
  );

  const filteredAvailable = availableSections.filter(
    (s) =>
      s.course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.course.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const colors = ["bg-course-orange", "bg-course-teal", "bg-course-green", "bg-course-purple", "bg-course-magenta", "bg-course-blue"];

  return (
    <div className="space-y-6">
      <div className="opacity-0 animate-fade-up" style={{ animationFillMode: "forwards" }}>
        <h1 className="text-2xl font-bold text-foreground">Add/Drop Courses</h1>
        <p className="text-muted-foreground">Manage your course enrollment for the current semester</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 opacity-0 animate-fade-up" style={{ animationDelay: "100ms", animationFillMode: "forwards" }}>
        {[
          { icon: "📚", label: "Enrolled Courses", value: enrolledSections.length, color: "text-primary" },
          { icon: "📊", label: "Total Credits", value: totalCredits, color: "text-course-orange" },
          { icon: "✅", label: "Available Sections", value: filteredAvailable.length, color: "text-course-green" },
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

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-6">
          {/* My Courses */}
          <div className="space-y-4 opacity-0 animate-fade-up" style={{ animationDelay: "200ms", animationFillMode: "forwards" }}>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">My Courses</h2>
              <span className="text-sm text-primary font-medium">{enrolledSections.length} enrolled</span>
            </div>
            <div className="space-y-4">
              {enrolledSections.length === 0 && (
                <div className="bg-card rounded-xl p-8 border border-border text-center text-muted-foreground">
                  No courses enrolled yet
                </div>
              )}
              {enrolledSections.map((sc: any, index: number) => {
                const course = sc.teacher_course?.course || {};
                const teacher = sc.teacher_course?.teacher?.user?.name || "TBA";
                return (
                  <div
                    key={sc.id}
                    className="bg-card rounded-xl p-5 border border-border shadow-card opacity-0 animate-fade-up transition-all hover:shadow-lg"
                    style={{ animationDelay: `${300 + index * 100}ms`, animationFillMode: "forwards" }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <span className={cn("text-xs font-semibold px-2 py-1 rounded text-white", colors[index % colors.length])}>
                          {course.code || "N/A"}
                        </span>
                        <span className="text-xs text-muted-foreground">{course.credit_hours || 0} credits</span>
                        <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">{sc.status}</span>
                      </div>
                      <button onClick={() => handleDrop(sc.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <h3 className="font-semibold text-foreground mt-3">{course.title || "Unknown"}</h3>
                    <p className="text-sm text-muted-foreground">{teacher}</p>
                    <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {sc.teacher_course?.schedule || "TBA"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      Section {sc.teacher_course?.section || "N/A"}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Available Courses */}
          <div className="space-y-4 opacity-0 animate-fade-up" style={{ animationDelay: "200ms", animationFillMode: "forwards" }}>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Available Sections</h2>
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
              {filteredAvailable.length === 0 && (
                <div className="bg-card rounded-xl p-8 border border-border text-center text-muted-foreground">
                  {searchQuery ? "No matching courses" : "No available courses"}
                </div>
              )}
              {filteredAvailable.map((section, index) => {
                const enrolled = section.enrolled_count || 0;
                const isFull = enrolled >= section.capacity;
                return (
                  <div
                    key={section.id}
                    className="bg-card rounded-xl p-5 border border-border shadow-card opacity-0 animate-fade-up transition-all hover:shadow-lg"
                    style={{ animationDelay: `${400 + index * 100}ms`, animationFillMode: "forwards" }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <span className={cn("text-xs font-semibold px-2 py-1 rounded text-white", colors[index % colors.length])}>
                          {section.course.code}
                        </span>
                        <span className="text-xs text-muted-foreground">{section.course.credit_hours} credits</span>
                        <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">{section.session_type}</span>
                        {section.eligible === false ? (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-destructive/10 text-destructive flex items-center gap-1">
                            <XCircle className="h-3 w-3" />
                            {section.reason || "Ineligible"}
                          </span>
                        ) : isFull ? (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-destructive/10 text-destructive flex items-center gap-1">
                            <XCircle className="h-3 w-3" />
                            Full
                          </span>
                        ) : (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-course-green/10 text-course-green flex items-center gap-1">
                            <CheckCircle className="h-3 w-3" />
                            Available
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => handleEnroll(section)}
                        disabled={isFull || section.eligible === false || enrollingId === section.id}
                        className={cn(
                          "h-8 w-8 rounded-full flex items-center justify-center transition-all",
                          !isFull && section.eligible !== false
                            ? "bg-primary text-primary-foreground hover:bg-primary/90"
                            : "bg-muted text-muted-foreground cursor-not-allowed"
                        )}
                      >
                        {enrollingId === section.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                      </button>
                    </div>
                    <h3 className="font-semibold text-foreground mt-3">{section.course.title}</h3>
                    <p className="text-sm text-muted-foreground">{section.teacher?.user?.name || "TBA"}</p>
                    <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {section.schedule}
                      </span>
                      <span>Section {section.section}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <Users className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {enrolled}/{section.capacity} enrolled
                      </span>
                      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all duration-500",
                            isFull ? "bg-destructive" : "bg-course-green"
                          )}
                          style={{ width: `${(enrolled / section.capacity) * 100}%` }}
                        />
                      </div>
                    </div>
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

export default Courses;
