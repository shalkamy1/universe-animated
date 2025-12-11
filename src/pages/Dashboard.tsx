import { BookOpen, Users, Calendar, AlertCircle } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import TodayClasses from "@/components/dashboard/TodayClasses";
import PendingAssignments from "@/components/dashboard/PendingAssignments";
import RecentGrades from "@/components/dashboard/RecentGrades";
import QuickActions from "@/components/dashboard/QuickActions";

const Dashboard = () => {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="opacity-0 animate-fade-up" style={{ animationFillMode: "forwards" }}>
        <h1 className="text-2xl font-bold text-foreground">Welcome back, Rawda!</h1>
        <p className="text-muted-foreground mt-1">Here's what's happening with your classes today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<BookOpen className="h-6 w-6" />}
          label="Total Courses"
          value={6}
          trend
          delay={100}
          iconColor="bg-primary/10 text-primary"
        />
        <StatCard
          icon={<Users className="h-6 w-6" />}
          label="Average GPA"
          value="3.8"
          trend
          delay={150}
          iconColor="bg-course-orange/10 text-course-orange"
        />
        <StatCard
          icon={<Calendar className="h-6 w-6" />}
          label="Classes Today"
          value={4}
          delay={200}
          iconColor="bg-course-green/10 text-course-green"
        />
        <StatCard
          icon={<AlertCircle className="h-6 w-6" />}
          label="Pending Tasks"
          value={8}
          delay={250}
          iconColor="bg-course-purple/10 text-course-purple"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Classes & Assignments */}
        <div className="lg:col-span-2 space-y-6">
          <TodayClasses />
          <PendingAssignments />
        </div>

        {/* Right Column - Grades & Actions */}
        <div className="space-y-6">
          <RecentGrades />
          <QuickActions />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
