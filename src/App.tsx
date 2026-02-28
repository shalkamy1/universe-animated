import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Timetable from "./pages/Timetable";
import Courses from "./pages/Courses";
import Attendance from "./pages/Attendance";
import FacultyPortal from "./pages/FacultyPortal";
import StudentAffairs from "./pages/StudentAffairs";
import Recommendations from "./pages/Recommendations";
import CurriculumManagement from "./pages/CurriculumManagement";
import RecordsEnrollment from "./pages/RecordsEnrollment";
import AdminPanel from "./pages/AdminPanel";
import DashboardLayout from "./components/layout/DashboardLayout";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/timetable" element={<Timetable />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/faculty" element={<FacultyPortal />} />
            <Route path="/student-affairs" element={<StudentAffairs />} />
            <Route path="/recommendations" element={<Recommendations />} />
            <Route path="/student-services" element={<StudentAffairs />} />
            <Route path="/self-services" element={<Dashboard />} />
            <Route path="/curriculum" element={<CurriculumManagement />} />
            <Route path="/records" element={<RecordsEnrollment />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/settings/password" element={<Dashboard />} />
            <Route path="/settings/account" element={<Dashboard />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
