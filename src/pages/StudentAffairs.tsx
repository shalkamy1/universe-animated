import { useState, useEffect } from "react";
import { FileText, Send, CheckCircle, XCircle, Clock, AlertTriangle, GraduationCap, Shield, Loader2 } from "lucide-react";
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
import { studentRequestService, studentService } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";

const StudentAffairs = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"requests" | "graduation" | "warnings">("requests");
  const [requestType, setRequestType] = useState("");
  const [requestDetails, setRequestDetails] = useState("");
  const [requests, setRequests] = useState<any[]>([]);
  const [graduation, setGraduation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [reqs, grad] = await Promise.all([
        studentRequestService.list().catch(() => []),
        user?.student?.id
          ? studentService.getGraduationPercentage(user.student.id).catch(() => null)
          : Promise.resolve(null),
      ]);
      setRequests(reqs);
      setGraduation(grad);
    } catch {
      // demo mode
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitRequest = async () => {
    if (!requestType || !requestDetails) {
      toast.error("Please fill all fields");
      return;
    }
    setSubmitting(true);
    try {
      await studentRequestService.create({
        student_id: user?.student?.id || "",
        request_type: requestType,
        details: requestDetails,
      });
      toast.success("Request submitted successfully!");
      setRequestType("");
      setRequestDetails("");
      await loadData();
    } catch (err: any) {
      toast.error(err?.message || "Failed to submit request");
    } finally {
      setSubmitting(false);
    }
  };

  const tabs = [
    { key: "requests" as const, icon: FileText, label: "My Requests" },
    { key: "graduation" as const, icon: GraduationCap, label: "Graduation Check" },
    { key: "warnings" as const, icon: AlertTriangle, label: "Academic Warnings" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

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
                placeholder="Details / Description"
                value={requestDetails}
                onChange={(e) => setRequestDetails(e.target.value)}
              />
              <Button onClick={handleSubmitRequest} variant="hero" className="w-full" disabled={submitting}>
                {submitting ? "Submitting..." : "Submit Request"}
              </Button>
            </div>
          </div>

          {/* Existing Requests */}
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground">Previous Requests</h3>
            {requests.length === 0 && (
              <div className="bg-card rounded-xl p-8 border border-border text-center text-muted-foreground">
                No requests yet
              </div>
            )}
            {requests.map((req: any, i: number) => (
              <div
                key={req.id}
                className="bg-card rounded-xl p-4 border border-border shadow-card opacity-0 animate-fade-up"
                style={{ animationDelay: `${300 + i * 100}ms`, animationFillMode: "forwards" }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-muted-foreground">#{req.id}</span>
                      <span className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary">{req.request_type}</span>
                    </div>
                    <p className="text-sm font-medium text-foreground">{req.details}</p>
                    {req.comment && <p className="text-xs text-muted-foreground mt-1">{req.comment}</p>}
                  </div>
                  <span className={cn(
                    "text-xs px-2 py-1 rounded-full flex items-center gap-1",
                    req.status === "approved" && "bg-course-green/10 text-course-green",
                    req.status === "pending" && "bg-course-orange/10 text-course-orange",
                    req.status === "in_progress" && "bg-primary/10 text-primary",
                    req.status === "rejected" && "bg-destructive/10 text-destructive"
                  )}>
                    {req.status === "approved" && <CheckCircle className="h-3 w-3" />}
                    {(req.status === "pending" || req.status === "in_progress") && <Clock className="h-3 w-3" />}
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
          {graduation ? (
            <>
              <div className="bg-card rounded-xl border border-border p-6">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">Graduation Progress</span>
                  <span className="text-sm font-bold text-primary">{graduation.percentage ?? 0}%</span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-1000"
                    style={{ width: `${graduation.percentage ?? 0}%` }}
                  />
                </div>
              </div>
              <pre className="bg-card rounded-xl border border-border p-6 text-sm text-muted-foreground overflow-auto">
                {JSON.stringify(graduation, null, 2)}
              </pre>
            </>
          ) : (
            <div className="bg-card rounded-xl border border-border p-8 text-center">
              <GraduationCap className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
              <p className="font-medium text-foreground">Graduation data not available</p>
              <p className="text-sm text-muted-foreground">Connect to the API to view graduation eligibility</p>
            </div>
          )}
        </div>
      )}

      {/* Warnings Tab */}
      {activeTab === "warnings" && (
        <div className="space-y-4 opacity-0 animate-fade-up" style={{ animationDelay: "200ms", animationFillMode: "forwards" }}>
          <div className="bg-course-green/5 border border-course-green/20 rounded-xl p-8 text-center">
            <CheckCircle className="h-10 w-10 text-course-green mx-auto mb-3" />
            <p className="font-semibold text-foreground">Academic warnings data</p>
            <p className="text-sm text-muted-foreground">Connect to the API to view warnings and disciplinary records</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentAffairs;
