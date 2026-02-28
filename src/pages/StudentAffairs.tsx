import { useState } from "react";
import { FileText, Send, CheckCircle, XCircle, Clock, AlertTriangle, GraduationCap, Shield } from "lucide-react";
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

const existingRequests = [
  { id: "REQ-001", type: "Data Update", subject: "Change phone number", date: "2024-03-08", status: "approved" },
  { id: "REQ-002", type: "Medical Excuse", subject: "Sick leave - 3 days", date: "2024-03-05", status: "pending" },
  { id: "REQ-003", type: "Course Withdrawal", subject: "Drop CS403 - Machine Learning", date: "2024-02-28", status: "rejected" },
];

const academicWarnings = [
  { semester: "Fall 2023", type: "Academic Probation", gpa: 1.8, message: "GPA below 2.0 — placed on probation" },
];

const graduationRequirements = {
  totalRequired: 132,
  completed: 105,
  inProgress: 12,
  remaining: 15,
  categories: [
    { name: "Core CS Courses", required: 60, completed: 54 },
    { name: "Math & Science", required: 30, completed: 27 },
    { name: "University Electives", required: 24, completed: 18 },
    { name: "General Education", required: 18, completed: 6 },
  ],
};

const StudentAffairs = () => {
  const [activeTab, setActiveTab] = useState<"requests" | "graduation" | "warnings">("requests");
  const [requestType, setRequestType] = useState("");
  const [requestSubject, setRequestSubject] = useState("");

  const handleSubmitRequest = () => {
    if (!requestType || !requestSubject) {
      toast.error("Please fill all fields");
      return;
    }
    toast.success("Request submitted successfully!");
    setRequestType("");
    setRequestSubject("");
  };

  const tabs = [
    { key: "requests" as const, icon: FileText, label: "My Requests" },
    { key: "graduation" as const, icon: GraduationCap, label: "Graduation Check" },
    { key: "warnings" as const, icon: AlertTriangle, label: "Academic Warnings" },
  ];

  return (
    <div className="space-y-6">
      <div className="opacity-0 animate-fade-up" style={{ animationFillMode: "forwards" }}>
        <h1 className="text-2xl font-bold text-foreground">Student Affairs</h1>
        <p className="text-muted-foreground">Submit requests, check graduation, and view academic standing</p>
      </div>

      <div className="flex gap-2 opacity-0 animate-fade-up" style={{ animationDelay: "100ms", animationFillMode: "forwards" }}>
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

      {/* Requests Tab */}
      {activeTab === "requests" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 opacity-0 animate-fade-up" style={{ animationDelay: "200ms", animationFillMode: "forwards" }}>
          {/* Submit New Request */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Send className="h-4 w-4 text-primary" />
              Submit New Request
            </h3>
            <div className="space-y-4">
              <Select value={requestType} onValueChange={setRequestType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select request type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="withdrawal">Course Withdrawal</SelectItem>
                  <SelectItem value="postponement">Semester Postponement</SelectItem>
                  <SelectItem value="data_update">Data Update</SelectItem>
                  <SelectItem value="medical">Medical Excuse</SelectItem>
                  <SelectItem value="complaint">Complaint</SelectItem>
                  <SelectItem value="graduation">Graduation Application</SelectItem>
                </SelectContent>
              </Select>
              <Input
                placeholder="Subject / Description"
                value={requestSubject}
                onChange={(e) => setRequestSubject(e.target.value)}
              />
              <Button onClick={handleSubmitRequest} variant="hero" className="w-full">
                Submit Request
              </Button>
            </div>
          </div>

          {/* Existing Requests */}
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground">Previous Requests</h3>
            {existingRequests.map((req, i) => (
              <div
                key={req.id}
                className="bg-card rounded-xl p-4 border border-border shadow-card opacity-0 animate-fade-up"
                style={{ animationDelay: `${300 + i * 100}ms`, animationFillMode: "forwards" }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-muted-foreground">{req.id}</span>
                      <span className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary">{req.type}</span>
                    </div>
                    <p className="text-sm font-medium text-foreground">{req.subject}</p>
                    <p className="text-xs text-muted-foreground mt-1">{req.date}</p>
                  </div>
                  <span className={cn(
                    "text-xs px-2 py-1 rounded-full flex items-center gap-1",
                    req.status === "approved" && "bg-course-green/10 text-course-green",
                    req.status === "pending" && "bg-course-orange/10 text-course-orange",
                    req.status === "rejected" && "bg-destructive/10 text-destructive"
                  )}>
                    {req.status === "approved" && <CheckCircle className="h-3 w-3" />}
                    {req.status === "pending" && <Clock className="h-3 w-3" />}
                    {req.status === "rejected" && <XCircle className="h-3 w-3" />}
                    {req.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Graduation Tab */}
      {activeTab === "graduation" && (
        <div className="space-y-6 opacity-0 animate-fade-up" style={{ animationDelay: "200ms", animationFillMode: "forwards" }}>
          {/* Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Total Required", value: graduationRequirements.totalRequired, color: "text-foreground" },
              { label: "Completed", value: graduationRequirements.completed, color: "text-course-green" },
              { label: "In Progress", value: graduationRequirements.inProgress, color: "text-course-orange" },
              { label: "Remaining", value: graduationRequirements.remaining, color: "text-destructive" },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className="stat-card text-center opacity-0 animate-fade-up"
                style={{ animationDelay: `${300 + i * 100}ms`, animationFillMode: "forwards" }}
              >
                <p className={cn("text-3xl font-bold", stat.color)}>{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Progress Bar */}
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-foreground">Overall Progress</span>
              <span className="text-sm font-bold text-primary">
                {Math.round((graduationRequirements.completed / graduationRequirements.totalRequired) * 100)}%
              </span>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-1000"
                style={{ width: `${(graduationRequirements.completed / graduationRequirements.totalRequired) * 100}%` }}
              />
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {graduationRequirements.categories.map((cat, i) => (
              <div
                key={cat.name}
                className="bg-card rounded-xl border border-border p-5 opacity-0 animate-fade-up"
                style={{ animationDelay: `${500 + i * 100}ms`, animationFillMode: "forwards" }}
              >
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">{cat.name}</span>
                  <span className="text-sm text-muted-foreground">{cat.completed}/{cat.required}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-1000",
                      cat.completed >= cat.required ? "bg-course-green" : "bg-primary"
                    )}
                    style={{ width: `${Math.min((cat.completed / cat.required) * 100, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Warnings Tab */}
      {activeTab === "warnings" && (
        <div className="space-y-4 opacity-0 animate-fade-up" style={{ animationDelay: "200ms", animationFillMode: "forwards" }}>
          {academicWarnings.length > 0 ? (
            academicWarnings.map((warning, i) => (
              <div
                key={i}
                className="bg-destructive/5 border border-destructive/20 rounded-xl p-5 flex items-start gap-4"
              >
                <Shield className="h-6 w-6 text-destructive mt-0.5" />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-foreground">{warning.type}</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-destructive/10 text-destructive">{warning.semester}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{warning.message}</p>
                  <p className="text-sm mt-1">GPA: <span className="font-bold text-destructive">{warning.gpa}</span></p>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-course-green/5 border border-course-green/20 rounded-xl p-8 text-center">
              <CheckCircle className="h-10 w-10 text-course-green mx-auto mb-3" />
              <p className="font-semibold text-foreground">No academic warnings</p>
              <p className="text-sm text-muted-foreground">You're in good academic standing!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentAffairs;
