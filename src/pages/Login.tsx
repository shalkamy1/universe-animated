import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import universityBuilding from "@/assets/university-building.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [language, setLanguage] = useState("english");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Side - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12 animate-fade-in">
        <img
          src={universityBuilding}
          alt="University Building"
          className="max-w-lg w-full animate-float"
        />
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md opacity-0 animate-fade-up" style={{ animationDelay: "200ms", animationFillMode: "forwards" }}>
          <div className="bg-card rounded-2xl shadow-lg border border-border p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-foreground">
                Welcome at <span className="text-primary">EduSphere</span>
              </h1>
              <div className="h-0.5 bg-gradient-to-r from-transparent via-border to-transparent mt-4" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2 opacity-0 animate-fade-up" style={{ animationDelay: "300ms", animationFillMode: "forwards" }}>
                <Label htmlFor="email" className="text-foreground font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter here"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 bg-muted/50 border-border"
                />
              </div>

              <div className="space-y-2 opacity-0 animate-fade-up" style={{ animationDelay: "400ms", animationFillMode: "forwards" }}>
                <Label htmlFor="password" className="text-foreground font-medium">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password here"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 bg-muted/50 border-border"
                />
              </div>

              <div className="space-y-2 opacity-0 animate-fade-up" style={{ animationDelay: "500ms", animationFillMode: "forwards" }}>
                <Label className="text-foreground font-medium">
                  Select a language
                </Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="h-12 bg-muted/50 border-border">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="arabic">Arabic</SelectItem>
                    <SelectItem value="french">French</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="opacity-0 animate-fade-up" style={{ animationDelay: "600ms", animationFillMode: "forwards" }}>
                <Button type="submit" variant="hero" className="w-full">
                  Sign In
                </Button>
              </div>

              <div className="text-center opacity-0 animate-fade-up" style={{ animationDelay: "700ms", animationFillMode: "forwards" }}>
                <a
                  href="#"
                  className="text-primary hover:underline text-sm font-medium transition-colors"
                >
                  Forget your password?
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
