import { Search, Settings, Bell } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Header = () => {
  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 animate-fade-in">
      {/* Search */}
      <div className="relative w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search courses, assignments, or materials..."
          className="pl-10 bg-background border-border"
        />
      </div>

      {/* Right side */}
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
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              RA
            </AvatarFallback>
          </Avatar>
          <div className="text-right">
            <p className="text-sm font-semibold text-foreground">Rawda Ayman</p>
            <p className="text-xs text-muted-foreground">Student</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
