import { ArrowLeft, Users, FileText, MessageSquare, AlertTriangle, Search, Bell, Check, X, MoreVertical, Download, Clock, Loader2, Shield, Key } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  userService,
  studentService,
  studentRequestService,
  adminService,
} from "@/services/api";

const AdminPanel = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [u, s, r, ro] = await Promise.all([
        userService.list().catch(() => []),
        studentService.list().catch(() => []),
        studentRequestService.list().catch(() => []),
        adminService.listRoles().catch(() => []),
      ]);
      setUsers(u);
      setStudents(s);
      setRequests(r);
      setRoles(ro);
    } catch {
      // demo
    } finally {
      setLoading(false);
    }
  };

  const handleApproveRequest = async (id: number | string) => {
    try {
      await studentRequestService.update(id, { status: "approved" });
      toast.success("Request approved");
      await loadData();
    } catch (err: any) {
      toast.error(err?.message || "Failed to approve");
    }
  };

  const handleRejectRequest = async (id: number | string) => {
    try {
      await studentRequestService.update(id, { status: "rejected" });
      toast.success("Request rejected");
      await loadData();
    } catch (err: any) {
      toast.error(err?.message || "Failed to reject");
    }
  };

  const pendingRequests = requests.filter((r: any) => r.status === "pending" || r.status === "in_progress");

  const adminStats = [
    { icon: Users, label: "TOTAL USERS", value: String(users.length), color: "bg-primary/10 text-primary" },
    { icon: FileText, label: "TOTAL STUDENTS", value: String(students.length), color: "bg-course-orange/10 text-course-orange" },
    { icon: MessageSquare, label: "PENDING REQUESTS", value: String(pendingRequests.length), color: "bg-destructive/10 text-destructive" },
    { icon: Shield, label: "ROLES", value: String(roles.length), color: "bg-course-purple/10 text-course-purple" },
  ];

  const filteredUsers = users.filter((u: any) =>
    (u.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (u.email || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

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
            <p className="text-muted-foreground">Manage users, requests, roles & permissions</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search users..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9 h-9" />
          </div>
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
              <div className={`h-12 w-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-3">{stat.label}</p>
              <p className="text-3xl font-bold text-foreground mt-1">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Tabs */}
        <div className="lg:col-span-2 opacity-0 animate-fade-up" style={{ animationFillMode: "forwards", animationDelay: "300ms" }}>
          <Tabs defaultValue="requests">
            <TabsList className="mb-4">
              <TabsTrigger value="requests" className="gap-2">
                <FileText className="h-4 w-4" /> Requests ({pendingRequests.length})
              </TabsTrigger>
              <TabsTrigger value="users" className="gap-2">
                <Users className="h-4 w-4" /> Users ({users.length})
              </TabsTrigger>
              <TabsTrigger value="roles" className="gap-2">
                <Key className="h-4 w-4" /> Roles
              </TabsTrigger>
            </TabsList>

            <TabsContent value="requests">
              <Card>
                <CardContent className="p-0">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left text-xs font-semibold text-muted-foreground p-4">STUDENT</th>
                        <th className="text-left text-xs font-semibold text-muted-foreground p-4">TYPE</th>
                        <th className="text-left text-xs font-semibold text-muted-foreground p-4">DETAILS</th>
                        <th className="text-left text-xs font-semibold text-muted-foreground p-4">STATUS</th>
                        <th className="text-left text-xs font-semibold text-muted-foreground p-4">ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {requests.length === 0 && (
                        <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">No requests</td></tr>
                      )}
                      {requests.map((r: any) => (
                        <tr key={r.id} className="border-b border-border/50 hover:bg-accent/30 transition-colors">
                          <td className="p-4">
                            <p className="text-sm font-medium text-foreground">{r.student?.user?.name || `Student #${r.student_id}`}</p>
                            <p className="text-xs text-muted-foreground">ID: {r.student_id}</p>
                          </td>
                          <td className="p-4">
                            <Badge variant="outline" className="text-[10px]">{r.request_type}</Badge>
                          </td>
                          <td className="p-4 text-sm text-foreground max-w-[200px] truncate">{r.details}</td>
                          <td className="p-4">
                            <Badge className={`text-[10px] ${
                              r.status === "approved" ? "bg-course-green/10 text-course-green" :
                              r.status === "rejected" ? "bg-destructive/10 text-destructive" :
                              "bg-course-orange/10 text-course-orange"
                            }`}>{r.status}</Badge>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <button onClick={() => handleApproveRequest(r.id)} className="h-8 w-8 rounded-lg flex items-center justify-center bg-course-green/10 text-course-green hover:bg-course-green/20 transition-colors">
                                <Check className="h-4 w-4" />
                              </button>
                              <button onClick={() => handleRejectRequest(r.id)} className="h-8 w-8 rounded-lg flex items-center justify-center bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors">
                                <X className="h-4 w-4" />
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

            <TabsContent value="users">
              <Card>
                <CardContent className="p-0">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left text-xs font-semibold text-muted-foreground p-4">NAME</th>
                        <th className="text-left text-xs font-semibold text-muted-foreground p-4">EMAIL</th>
                        <th className="text-left text-xs font-semibold text-muted-foreground p-4">ROLE</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.length === 0 && (
                        <tr><td colSpan={3} className="p-8 text-center text-muted-foreground">No users found</td></tr>
                      )}
                      {filteredUsers.map((u: any) => (
                        <tr key={u.id} className="border-b border-border/50 hover:bg-accent/30 transition-colors">
                          <td className="p-4 text-sm font-medium text-foreground">{u.name}</td>
                          <td className="p-4 text-sm text-muted-foreground">{u.email}</td>
                          <td className="p-4">
                            <Badge variant="outline" className="text-[10px]">{u.role || "user"}</Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="roles">
              <Card>
                <CardContent className="p-6">
                  {roles.length === 0 ? (
                    <p className="text-center text-muted-foreground">No roles configured — connect to the API</p>
                  ) : (
                    <div className="space-y-3">
                      {roles.map((role: any) => (
                        <div key={role.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                          <div className="flex items-center gap-3">
                            <Shield className="h-5 w-5 text-primary" />
                            <span className="font-medium text-foreground">{role.name}</span>
                          </div>
                          <Badge variant="outline" className="text-[10px]">ID: {role.id}</Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Quick Info */}
        <Card className="opacity-0 animate-fade-up" style={{ animationFillMode: "forwards", animationDelay: "400ms" }}>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-lg font-bold text-foreground">API Status</h2>
            </div>
            <div className="space-y-4 text-sm">
              <div className="flex items-center gap-3">
                <div className={`h-2.5 w-2.5 rounded-full ${users.length > 0 ? "bg-course-green" : "bg-course-orange"}`} />
                <span className="text-foreground">Users: {users.length > 0 ? "Connected" : "No data"}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className={`h-2.5 w-2.5 rounded-full ${students.length > 0 ? "bg-course-green" : "bg-course-orange"}`} />
                <span className="text-foreground">Students: {students.length > 0 ? "Connected" : "No data"}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className={`h-2.5 w-2.5 rounded-full ${requests.length > 0 ? "bg-course-green" : "bg-course-orange"}`} />
                <span className="text-foreground">Requests: {requests.length > 0 ? "Connected" : "No data"}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className={`h-2.5 w-2.5 rounded-full ${roles.length > 0 ? "bg-course-green" : "bg-course-orange"}`} />
                <span className="text-foreground">Roles: {roles.length > 0 ? "Connected" : "No data"}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPanel;
