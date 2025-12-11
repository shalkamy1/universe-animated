import { cn } from "@/lib/utils";
import { TrendingUp } from "lucide-react";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  trend?: boolean;
  delay?: number;
  iconColor?: string;
}

const StatCard = ({ icon, label, value, trend, delay = 0, iconColor = "bg-primary/10 text-primary" }: StatCardProps) => {
  return (
    <div
      className="stat-card opacity-0 animate-fade-up"
      style={{ animationDelay: `${delay}ms`, animationFillMode: "forwards" }}
    >
      <div className="flex items-start justify-between">
        <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center", iconColor)}>
          {icon}
        </div>
        {trend && (
          <TrendingUp className="h-5 w-5 text-course-green" />
        )}
      </div>
      <div className="mt-4">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-3xl font-bold text-foreground mt-1">{value}</p>
      </div>
    </div>
  );
};

export default StatCard;
