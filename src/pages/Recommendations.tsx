import { useState } from "react";
import { Lightbulb, TrendingUp, Target, AlertTriangle, CheckCircle, Star, Zap, Loader2, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { advisorService } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";

const Recommendations = () => {
  const { user } = useAuth();
  const [scenario, setScenario] = useState<"improve_gpa" | "finish_courses">("improve_gpa");
  const [recommendations, setRecommendations] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [customMessage, setCustomMessage] = useState("");

  const scenarioMessages: Record<string, string> = {
    improve_gpa: "I want to improve my GPA. Recommend courses with higher success rates and better grade impact.",
    finish_courses: "I want to finish my remaining courses and graduate as fast as possible.",
  };

  const handleGetRecommendations = async () => {
    const studentId = user?.student?.id;
    if (!studentId) {
      toast.error("Student profile not found — connect to the API");
      return;
    }
    setLoading(true);
    try {
      const message = customMessage || scenarioMessages[scenario];
      const result = await advisorService.recommend(studentId, message);
      setRecommendations(result);
      toast.success("Recommendations generated!");
    } catch (err: any) {
      if (err?.message === "NO_API") {
        toast.info("No API configured — connect your backend to get real recommendations");
      } else {
        toast.error(err?.message || "Failed to get recommendations");
      }
    } finally {
      setLoading(false);
    }
  };

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

      {/* Custom Message */}
      <div className="flex gap-3 opacity-0 animate-fade-up" style={{ animationDelay: "200ms", animationFillMode: "forwards" }}>
        <div className="relative flex-1">
          <MessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Or type a custom advising question..."
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="hero" onClick={handleGetRecommendations} disabled={loading} className="gap-2">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
          Get Recommendations
        </Button>
      </div>

      {/* Results */}
      {recommendations && (
        <div className="space-y-4 opacity-0 animate-fade-up" style={{ animationDelay: "300ms", animationFillMode: "forwards" }}>
          <h2 className="text-lg font-semibold text-foreground">AI Advisor Response</h2>
          {typeof recommendations === "string" ? (
            <div className="bg-card rounded-xl p-6 border border-border">
              <p className="text-foreground whitespace-pre-wrap">{recommendations}</p>
            </div>
          ) : (
            <pre className="bg-card rounded-xl p-6 border border-border text-sm text-foreground overflow-auto">
              {JSON.stringify(recommendations, null, 2)}
            </pre>
          )}
        </div>
      )}

      {/* Placeholder when no results yet */}
      {!recommendations && !loading && (
        <div className="bg-card rounded-xl border border-border p-8 text-center opacity-0 animate-fade-up" style={{ animationDelay: "300ms", animationFillMode: "forwards" }}>
          <Lightbulb className="h-12 w-12 text-course-orange/30 mx-auto mb-3" />
          <p className="font-medium text-foreground">Select a scenario and click "Get Recommendations"</p>
          <p className="text-sm text-muted-foreground mt-1">The AI advisor will analyze your academic profile and suggest courses</p>
        </div>
      )}

      {/* Academic Alerts placeholder */}
      <div className="space-y-3 opacity-0 animate-fade-up" style={{ animationDelay: "400ms", animationFillMode: "forwards" }}>
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-course-orange" />
          Academic Alerts
        </h2>
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-start gap-3">
          <Target className="h-5 w-5 text-primary mt-0.5 shrink-0" />
          <p className="text-sm text-foreground">Connect to the API to view personalized academic alerts based on your GPA history.</p>
        </div>
      </div>
    </div>
  );
};

export default Recommendations;
