/**
 * API Service Layer — matches the Laravel backend (Postman collection).
 * Set VITE_API_BASE_URL in your environment to point at the backend.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

// ── Token management ────────────────────────────────────────
let authToken: string | null = localStorage.getItem("auth_token");

export const setAuthToken = (token: string | null) => {
  authToken = token;
  if (token) localStorage.setItem("auth_token", token);
  else localStorage.removeItem("auth_token");
};

export const getAuthToken = () => authToken;

const getHeaders = (): Record<string, string> => ({
  "Content-Type": "application/json",
  Accept: "application/json",
  ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
});

// ── Generic request helper ──────────────────────────────────
async function api<T>(endpoint: string, options?: RequestInit): Promise<T> {
  if (!API_BASE_URL) {
    console.warn(`[API] No VITE_API_BASE_URL — ${options?.method ?? "GET"} ${endpoint}`);
    throw new Error("NO_API");
  }
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: { ...getHeaders(), ...options?.headers },
  });
  if (res.status === 401) {
    setAuthToken(null);
    window.location.href = "/login";
    throw new Error("Unauthenticated");
  }
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`API ${res.status}: ${body}`);
  }
  if (res.status === 204) return {} as T;
  return res.json();
}

// ── Auth ─────────────────────────────────────────────────────
export const authService = {
  register: (data: { name: string; email: string; password: string }) =>
    api<{ token: string; user: any }>("/api/register", { method: "POST", body: JSON.stringify(data) }),

  login: async (email: string, password: string) => {
    const res = await api<{ token: string; user: any }>("/api/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    if (res.token) setAuthToken(res.token);
    return res;
  },

  logout: async () => {
    try { await api("/api/logout", { method: "POST" }); } catch { /* ok */ }
    setAuthToken(null);
  },

  getCurrentUser: () => api<any>("/api/v1/user"),
};

// ── Users (admin) ────────────────────────────────────────────
export const userService = {
  list: () => api<any[]>("/api/v1/users"),
  get: (id: number | string) => api<any>(`/api/v1/users/${id}`),
  create: (data: { name: string; email: string; password: string; role: string }) =>
    api<any>("/api/v1/users", { method: "POST", body: JSON.stringify(data) }),
  update: (id: number | string, data: { name?: string; email?: string; password?: string; role?: string }) =>
    api<any>(`/api/v1/users/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: number | string) => api<void>(`/api/v1/users/${id}`, { method: "DELETE" }),
};

// ── Students ─────────────────────────────────────────────────
export const studentService = {
  list: () => api<any[]>("/api/v1/students"),
  get: (id: number | string) => api<any>(`/api/v1/students/${id}`),
  create: (data: { user_id: string; credit_hours: number; program: string; level: number }) =>
    api<any>("/api/v1/students", { method: "POST", body: JSON.stringify(data) }),
  update: (id: number | string, data: { credit_hours?: number; program?: string; level?: number }) =>
    api<any>(`/api/v1/students/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: number | string) => api<void>(`/api/v1/students/${id}`, { method: "DELETE" }),

  // Academic
  getAvailableCourses: (studentId: number | string) =>
    api<any[]>(`/api/v1/students/${studentId}/available-courses`),
  getGPA: (studentId: number | string, semesterId: number | string) =>
    api<any>(`/api/v1/students/${studentId}/gpa/${semesterId}`),
  getCGPA: (studentId: number | string) =>
    api<any>(`/api/v1/students/${studentId}/cgpa`),
  getTranscript: (studentId: number | string) =>
    api<any>(`/api/v1/students/${studentId}/transcript`),
  getGraduationPercentage: (studentId: number | string) =>
    api<any>(`/api/v1/students/${studentId}/graduation-percentage`),
  getHonorStatus: (studentId: number | string) =>
    api<any>(`/api/v1/students/${studentId}/honor-status`),
};

// ── Faculty Members ──────────────────────────────────────────
export const facultyService = {
  list: () => api<any[]>("/api/v1/faculty-members"),
  get: (id: number | string) => api<any>(`/api/v1/faculty-members/${id}`),
  create: (data: { user_id: string; department: string; employment_type: string }) =>
    api<any>("/api/v1/faculty-members", { method: "POST", body: JSON.stringify(data) }),
  update: (id: number | string, data: { department?: string; employment_type?: string }) =>
    api<any>(`/api/v1/faculty-members/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: number | string) => api<void>(`/api/v1/faculty-members/${id}`, { method: "DELETE" }),
};

// ── Student Affairs Staff ────────────────────────────────────
export const studentAffairsStaffService = {
  list: () => api<any[]>("/api/v1/student-affairs"),
  get: (id: number | string) => api<any>(`/api/v1/student-affairs/${id}`),
  create: (data: { user_id: string; department: string }) =>
    api<any>("/api/v1/student-affairs", { method: "POST", body: JSON.stringify(data) }),
  update: (id: number | string, data: { department?: string }) =>
    api<any>(`/api/v1/student-affairs/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: number | string) => api<void>(`/api/v1/student-affairs/${id}`, { method: "DELETE" }),
};

// ── Courses ──────────────────────────────────────────────────
export const courseService = {
  list: () => api<any[]>("/api/v1/courses"),
  get: (id: number | string) => api<any>(`/api/v1/courses/${id}`),
  create: (data: { code: string; title: string; description: string; credit_hours: number }) =>
    api<any>("/api/v1/courses", { method: "POST", body: JSON.stringify(data) }),
  update: (id: number | string, data: { code?: string; title?: string; description?: string; credit_hours?: number }) =>
    api<any>(`/api/v1/courses/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: number | string) => api<void>(`/api/v1/courses/${id}`, { method: "DELETE" }),
};

// ── Course Materials ─────────────────────────────────────────
export const courseMaterialService = {
  list: () => api<any[]>("/api/v1/course-materials"),
  get: (id: number | string) => api<any>(`/api/v1/course-materials/${id}`),
  create: (data: { course_id: string; material_name: string }) =>
    api<any>("/api/v1/course-materials", { method: "POST", body: JSON.stringify(data) }),
  update: (id: number | string, data: { material_name?: string }) =>
    api<any>(`/api/v1/course-materials/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: number | string) => api<void>(`/api/v1/course-materials/${id}`, { method: "DELETE" }),
};

// ── Student Courses (Enrollment) ─────────────────────────────
export const studentCourseService = {
  list: () => api<any[]>("/api/v1/student-courses"),
  get: (id: number | string) => api<any>(`/api/v1/student-courses/${id}`),
  create: (data: {
    student_id: string;
    teacher_course_id: string;
    status: string;
    total_score?: number;
    letter_grade?: string;
    grade_points?: number;
    registered_at?: string;
  }) => api<any>("/api/v1/student-courses", { method: "POST", body: JSON.stringify(data) }),
  update: (id: number | string, data: { status?: string; total_score?: number; letter_grade?: string; grade_points?: number }) =>
    api<any>(`/api/v1/student-courses/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: number | string) => api<void>(`/api/v1/student-courses/${id}`, { method: "DELETE" }),
  getGrades: (studentCourseId: number | string) =>
    api<any[]>(`/api/v1/student-courses/${studentCourseId}/grades`),
  finalize: (studentCourseId: number | string) =>
    api<any>(`/api/v1/student-courses/${studentCourseId}/finalize`, { method: "POST" }),
};

// ── Student Phones ───────────────────────────────────────────
export const studentPhoneService = {
  list: () => api<any[]>("/api/v1/student-phones"),
  get: (id: number | string) => api<any>(`/api/v1/student-phones/${id}`),
  create: (data: { student_id: string; phone: string }) =>
    api<any>("/api/v1/student-phones", { method: "POST", body: JSON.stringify(data) }),
  update: (id: number | string, data: { phone: string }) =>
    api<any>(`/api/v1/student-phones/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: number | string) => api<void>(`/api/v1/student-phones/${id}`, { method: "DELETE" }),
};

// ── Student Requests ─────────────────────────────────────────
export const studentRequestService = {
  list: () => api<any[]>("/api/v1/student-requests"),
  get: (id: number | string) => api<any>(`/api/v1/student-requests/${id}`),
  create: (data: { student_id: string; request_type: string; details: string; status?: string; comment?: string }) =>
    api<any>("/api/v1/student-requests", { method: "POST", body: JSON.stringify(data) }),
  update: (id: number | string, data: { request_type?: string; details?: string; status?: string; comment?: string }) =>
    api<any>(`/api/v1/student-requests/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: number | string) => api<void>(`/api/v1/student-requests/${id}`, { method: "DELETE" }),
};

// ── Teacher Courses (Sections) ───────────────────────────────
export const teacherCourseService = {
  list: () => api<any[]>("/api/v1/teacher-courses"),
  get: (id: number | string) => api<any>(`/api/v1/teacher-courses/${id}`),
  create: (data: {
    semester_id: string;
    teacher_id: string;
    course_id: string;
    schedule: string;
    capacity: number;
    session_type: string;
    section: string;
  }) => api<any>("/api/v1/teacher-courses", { method: "POST", body: JSON.stringify(data) }),
  update: (id: number | string, data: { schedule?: string; capacity?: number; session_type?: string; section?: string }) =>
    api<any>(`/api/v1/teacher-courses/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: number | string) => api<void>(`/api/v1/teacher-courses/${id}`, { method: "DELETE" }),
};

// ── Grade Components ─────────────────────────────────────────
export const gradeComponentService = {
  list: (teacherCourseId: number | string) =>
    api<any[]>(`/api/v1/teacher-courses/${teacherCourseId}/grade-components`),
  create: (teacherCourseId: number | string, data: {
    name: string;
    type: string;
    max_score: number;
    weight_percentage: number;
    is_active: boolean;
  }) => api<any>(`/api/v1/teacher-courses/${teacherCourseId}/grade-components`, {
    method: "POST",
    body: JSON.stringify(data),
  }),
  validate: (teacherCourseId: number | string) =>
    api<any>(`/api/v1/teacher-courses/${teacherCourseId}/grade-components/validate`),
  update: (gradeComponentId: number | string, data: {
    name?: string;
    type?: string;
    max_score?: number;
    weight_percentage?: number;
    is_active?: boolean;
  }) => api<any>(`/api/v1/grade-components/${gradeComponentId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  }),
  delete: (gradeComponentId: number | string) =>
    api<void>(`/api/v1/grade-components/${gradeComponentId}`, { method: "DELETE" }),
};

// ── Grades ───────────────────────────────────────────────────
export const gradeService = {
  enter: (data: { student_course_id: string; grade_component_id: string; score: number; remarks?: string }) =>
    api<any>("/api/v1/grades", { method: "POST", body: JSON.stringify(data) }),
  bulkEnter: (data: {
    grade_component_id: string;
    scores: Array<{ student_course_id: string; score: number; remarks?: string }>;
  }) => api<any>("/api/v1/grades/bulk", { method: "POST", body: JSON.stringify(data) }),
};

// ── Student Registration ─────────────────────────────────────
export const registrationService = {
  getAvailableCourses: () => api<any[]>("/api/v1/student/registration/courses"),
  register: (teacherCourseId: number) =>
    api<any>("/api/v1/student/registration/register", {
      method: "POST",
      body: JSON.stringify({ teacher_course_id: teacherCourseId }),
    }),
};

// ── Advisor / Recommendations ────────────────────────────────
export const advisorService = {
  recommend: (studentId: number | string, message: string) =>
    api<any>(`/api/v1/advisor/recommend/${studentId}`, {
      method: "POST",
      body: JSON.stringify({ message }),
    }),
};

// ── Admin: Roles & Permissions ───────────────────────────────
export const adminService = {
  // Roles
  listRoles: () => api<any[]>("/api/v1/admin/roles"),
  getRole: (id: number | string) => api<any>(`/api/v1/admin/roles/${id}`),
  createRole: (data: { name: string }) =>
    api<any>("/api/v1/admin/roles", { method: "POST", body: JSON.stringify(data) }),
  updateRole: (id: number | string, data: { name: string }) =>
    api<any>(`/api/v1/admin/roles/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteRole: (id: number | string) => api<void>(`/api/v1/admin/roles/${id}`, { method: "DELETE" }),

  // Permissions
  listPermissions: () => api<any[]>("/api/v1/admin/permissions"),
  getPermission: (id: number | string) => api<any>(`/api/v1/admin/permissions/${id}`),
  createPermission: (data: { name: string }) =>
    api<any>("/api/v1/admin/permissions", { method: "POST", body: JSON.stringify(data) }),
  updatePermission: (id: number | string, data: { name: string }) =>
    api<any>(`/api/v1/admin/permissions/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deletePermission: (id: number | string) =>
    api<void>(`/api/v1/admin/permissions/${id}`, { method: "DELETE" }),

  // Role-Permissions
  getRolePermissions: (roleId: number | string) =>
    api<any[]>(`/api/v1/admin/roles/${roleId}/permissions`),
  syncRolePermissions: (roleId: number | string, permissions: string[]) =>
    api<any>(`/api/v1/admin/roles/${roleId}/permissions`, {
      method: "POST",
      body: JSON.stringify({ permissions }),
    }),

  // User-Roles
  getUserRoles: (userId: number | string) =>
    api<any[]>(`/api/v1/admin/users/${userId}/roles`),
  assignRole: (userId: number | string, role: string) =>
    api<any>(`/api/v1/admin/users/${userId}/roles`, {
      method: "POST",
      body: JSON.stringify({ role }),
    }),
  revokeRole: (userId: number | string, roleId: number | string) =>
    api<void>(`/api/v1/admin/users/${userId}/roles/${roleId}`, { method: "DELETE" }),
};
