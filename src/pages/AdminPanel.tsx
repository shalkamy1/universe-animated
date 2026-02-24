import { ArrowLeft, Users, FileText, MessageSquare, AlertTriangle, Search, Bell, Check, X, MoreVertical, Download, Clock } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const adminStats = [
  { icon: Users, label: "TOTAL STUDENTS", value: "2,450", color: "bg-primary/10 text-primary" },
  { icon: FileText, label: "PENDING EXCUSES", value: "18", color: "bg-course-orange/10 text-course-orange" },
  { icon: MessageSquare, label: "NEW COMPLAINTS", value: "5", color: "bg-destructive/10 text-destructive" },
  { icon: AlertTriangle, label: "WARNING ISSUED", value: "12", color: "bg-course-purple/10 text-course-purple" },
];

const excuses = [
  { name: "Ahmed Ali", id: "221001", type: "MEDICAL", issue: "Severe Flu", date: "15 Oct" },
  { name: "Sarah Smith", id: "223045", type: "MEDICAL", issue: "Medical Surgery", date: "14 Oct" },
  { name: "Omar Hassan", id: "222078", type: "MEDICAL", issue: "Dental Emergency", date: "13 Oct" },
];

const complaints = [
  { name: "Fatima Noor", id: "221090", type: "ACADEMIC", issue: "Grade Dispute - CS301", date: "16 Oct" },
  { name: "Ali Khaled", id: "223011", type: "GENERAL", issue: "Library Hours", date: "15 Oct" },
];

const logs = [
  { time: "2M AGO", who: "Admin Sarah", action: "Approved Excuse #092", color: "bg-course-green" },
  { time: "1H AGO", who: "System", action: "Issued Warning (Attendance)", color: "bg-course-orange" },
  { time: "3H AGO", who: "Admin Mike", action: "Resolved Complaint #045", color: "bg-primary" },
  { time: "5H AGO", who: "System", action: "New Student Registered", color: "bg-course-purple" },
];

const AdminPanel = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between opacity-0 animate-fade-up" style={{ animationFillMode: "forwards" }}>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="h-10 w-10 rounded-lg flex items-center justify-center hover:bg-accent transition-colors">
            <ArrowLeft className="h-5 w-5 text-muted-foreground" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage university services and student requests</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search records..." className="pl-9 h-9" />
          </div>
          <button className="relative h-9 w-9 rounded-lg flex items-center justify-center hover:bg-accent transition-colors">
            <Bell className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {adminStats.map((stat, i) => (
          <Card
            key={stat.label}
            className="opacity-0 animate-fade-up"
            style={{ animationFillMode: "forwards", animationDelay: `${i * 100}ms` }}
          >
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div className={`h-12 w-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-3">{stat.label}</p>
              <p className="text-3xl font-bold text-foreground mt-1">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Table */}
        <div className="lg:col-span-2 opacity-0 animate-fade-up" style={{ animationFillMode: "forwards", animationDelay: "300ms" }}>
          <Tabs defaultValue="excuses">
            <TabsList className="mb-4">
              <TabsTrigger value="excuses" className="gap-2">
                <FileText className="h-4 w-4" /> Medical Excuses
              </TabsTrigger>
              <TabsTrigger value="complaints" className="gap-2">
                <MessageSquare className="h-4 w-4" /> Complaints
              </TabsTrigger>
              <TabsTrigger value="students" className="gap-2">
                <Users className="h-4 w-4" /> Students List
              </TabsTrigger>
            </TabsList>

            <TabsContent value="excuses">
              <Card>
                <CardContent className="p-0">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left text-xs font-semibold text-muted-foreground p-4">STUDENT</th>
                        <th className="text-left text-xs font-semibold text-muted-foreground p-4">ISSUE</th>
                        <th className="text-left text-xs font-semibold text-muted-foreground p-4">DATE</th>
                        <th className="text-left text-xs font-semibold text-muted-foreground p-4">DOCUMENT</th>
                        <th className="text-left text-xs font-semibold text-muted-foreground p-4">ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {excuses.map((e, i) => (
                        <tr key={e.id} className="border-b border-border/50 hover:bg-accent/30 transition-colors">
                          <td className="p-4">
                            <p className="text-sm font-medium text-foreground">{e.name}</p>
                            <p className="text-xs text-muted-foreground">ID: {e.id}</p>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <Badge variant="destructive" className="text-[10px]">{e.type}</Badge>
                              <span className="text-sm text-foreground">{e.issue}</span>
                            </div>
                          </td>
                          <td className="p-4 text-sm text-muted-foreground">{e.date}</td>
                          <td className="p-4">
                            <button className="text-sm text-primary flex items-center gap-1 hover:underline">
                              <Download className="h-3 w-3" /> View
                            </button>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <button className="h-8 w-8 rounded-lg flex items-center justify-center bg-course-green/10 text-course-green hover:bg-course-green/20 transition-colors">
                                <Check className="h-4 w-4" />
                              </button>
                              <button className="h-8 w-8 rounded-lg flex items-center justify-center bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors">
                                <X className="h-4 w-4" />
                              </button>
                              <button className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-accent transition-colors">
                                <MoreVertical className="h-4 w-4 text-muted-foreground" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="complaints">
              <Card>
                <CardContent className="p-0">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left text-xs font-semibold text-muted-foreground p-4">STUDENT</th>
                        <th className="text-left text-xs font-semibold text-muted-foreground p-4">ISSUE</th>
                        <th className="text-left text-xs font-semibold text-muted-foreground p-4">DATE</th>
                        <th className="text-left text-xs font-semibold text-muted-foreground p-4">ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {complaints.map((c) => (
                        <tr key={c.id} className="border-b border-border/50 hover:bg-accent/30 transition-colors">
                          <td className="p-4">
                            <p className="text-sm font-medium text-foreground">{c.name}</p>
                            <p className="text-xs text-muted-foreground">ID: {c.id}</p>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <Badge className="text-[10px] bg-course-orange/10 text-course-orange border-course-orange/30">{c.type}</Badge>
                              <span className="text-sm text-foreground">{c.issue}</span>
                            </div>
                          </td>
                          <td className="p-4 text-sm text-muted-foreground">{c.date}</td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <button className="h-8 w-8 rounded-lg flex items-center justify-center bg-course-green/10 text-course-green hover:bg-course-green/20 transition-colors">
                                <Check className="h-4 w-4" />
                              </button>
                              <button className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-accent transition-colors">
                                <MoreVertical className="h-4 w-4 text-muted-foreground" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="students">
              <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
                  <p className="font-medium">Students list coming soon</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Recent Logs */}
        <Card className="opacity-0 animate-fade-up" style={{ animationFillMode: "forwards", animationDelay: "400ms" }}>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-lg font-bold text-foreground">Recent Logs</h2>
            </div>
            <div className="space-y-4">
              {logs.map((log, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`h-2.5 w-2.5 rounded-full ${log.color} mt-1.5 shrink-0`} />
                  <div>
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase">{log.time}</p>
                    <p className="text-sm font-medium text-foreground">{log.who}</p>
                    <p className="text-xs text-muted-foreground">{log.action}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPanel;
