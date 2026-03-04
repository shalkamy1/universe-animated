import { Search, Settings, Bell, LogOut } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const initials = user?.name ? user.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase() : "U";

  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 animate-fade-in">
      <div className="relative w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search courses, assignments, or materials..." className="pl-10 bg-background border-border" />
      </div>
      <div className="flex items-center gap-4">
        <button className="h-10 w-10 rounded-lg flex items-center justify-center hover:bg-accent transition-colors duration-200">
          <Settings className="h-5 w-5 text-muted-foreground" />
        </button>
        <button className="h-10 w-10 rounded-lg flex items-center justify-center hover:bg-accent transition-colors duration-200 relative">
          <Bell className="h-5 w-5 text-muted-foreground" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary animate-pulse" />
        </button>
        <div className="flex items-center gap-3 ml-2">
          <Avatar className="h-10 w-10 border-2 border-primary/20">
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">{initials}</AvatarFallback>
          </Avatar>
          <div className="text-right">
            <p className="text-sm font-semibold text-foreground">{user?.name || "User"}</p>
            <p className="text-xs text-muted-foreground">{user?.role || "Student"}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="h-10 w-10 rounded-lg flex items-center justify-center hover:bg-destructive/10 transition-colors duration-200" title="Logout">
          <LogOut className="h-5 w-5 text-muted-foreground" />
        </button>
      </div>
    </header>
  );
};

export default Header;
