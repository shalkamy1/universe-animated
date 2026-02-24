import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  GraduationCap,
  BookOpen,
  FileText,
  Settings,
  ChevronDown,
  ChevronRight,
  LogOut,
  HelpCircle,
  QrCode,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  to?: string;
  children?: { label: string; to: string }[];
}

const SidebarItem = ({ icon: Icon, label, to, children }: SidebarItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isActive = to ? location.pathname === to : children?.some(c => location.pathname === c.to);

  if (children) {
    return (
      <div className="animate-fade-up">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "sidebar-link w-full justify-between",
            isActive && "sidebar-link-active"
          )}
        >
          <div className="flex items-center gap-3">
            <Icon className="h-5 w-5" />
            <span>{label}</span>
          </div>
          {isOpen ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </button>
        {isOpen && (
          <div className="ml-8 mt-1 space-y-1 animate-fade-in">
            {children.map((child) => (
              <NavLink
                key={child.to}
                to={child.to}
                className={({ isActive }) =>
                  cn(
                    "block px-4 py-2 rounded-lg text-sm transition-all duration-200",
                    isActive
                      ? "text-primary font-medium bg-sidebar-accent"
                      : "text-sidebar-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent"
                  )
                }
              >
                {child.label}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <NavLink
      to={to || "/"}
      className={({ isActive }) =>
        cn("sidebar-link animate-fade-up", isActive && "sidebar-link-active")
      }
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </NavLink>
  );
};

const Sidebar = () => {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-sidebar border-r border-sidebar-border flex flex-col z-50">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border animate-slide-in-left">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
            <GraduationCap className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-bold text-foreground">EDUSPHERE</h1>
            <p className="text-xs text-muted-foreground">Student Portal</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <SidebarItem icon={LayoutDashboard} label="Dashboard" to="/dashboard" />
        <SidebarItem icon={QrCode} label="Attendance QR" to="/timetable" />
        <SidebarItem icon={GraduationCap} label="Student Services" to="/student-services" />
        <SidebarItem icon={BookOpen} label="Curriculum Management" to="/curriculum" />
        <SidebarItem icon={FileText} label="Records and Enrollment" to="/records" />
        <SidebarItem icon={ShieldCheck} label="Admin Panel" to="/admin" />
        <SidebarItem
          icon={Settings}
          label="Settings"
          children={[
            { label: "Change My Password", to: "/settings/password" },
            { label: "Account Settings", to: "/settings/account" },
          ]}
        />
        <SidebarItem icon={LogOut} label="Log Out" to="/login" />
      </nav>

      {/* Help Card */}
      <div className="p-4 animate-fade-up" style={{ animationDelay: "0.5s" }}>
        <div className="bg-primary/5 rounded-xl p-4 border border-primary/10">
          <div className="flex items-center gap-2 mb-2">
            <HelpCircle className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-foreground">Need Help?</span>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            Contact support team
          </p>
          <Button variant="default" size="sm" className="w-full">
            Get Support
          </Button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
