/**
 * API Service Layer - Ready for external API integration
 * Replace mock implementations with real API calls when backend is connected.
 * 
 * To connect to a real API:
 * 1. Set the API_BASE_URL environment variable
 * 2. Replace mock functions with fetch/axios calls
 * 3. Add authentication headers via getAuthHeaders()
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

// Auth token management
let authToken: string | null = localStorage.getItem("auth_token");

export const setAuthToken = (token: string | null) => {
  authToken = token;
  if (token) localStorage.setItem("auth_token", token);
  else localStorage.removeItem("auth_token");
};

export const getAuthToken = () => authToken;

const getAuthHeaders = (): Record<string, string> => ({
  "Content-Type": "application/json",
  ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
});

// Generic API helper
async function apiRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
  if (!API_BASE_URL) {
    console.warn(`[API Mock] ${endpoint} — No API_BASE_URL configured, using mock data.`);
    throw new Error("NO_API");
  }
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: { ...getAuthHeaders(), ...options?.headers },
  });
  if (!res.ok) throw new Error(`API Error ${res.status}: ${await res.text()}`);
  return res.json();
}

// ─── Auth Service ───────────────────────────────────────────
export const authService = {
  login: async (email: string, password: string) => {
    try {
      return await apiRequest<{ token: string; user: any }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
    } catch {
      // Mock: accept any credentials
      const mockToken = "mock_token_" + Date.now();
      setAuthToken(mockToken);
      return { token: mockToken, user: { id: "1", email, name: "Ahmed Hassan", role: "student" } };
    }
  },
  logout: async () => {
    try {
      await apiRequest("/auth/logout", { method: "POST" });
    } catch { /* mock */ }
    setAuthToken(null);
  },
  getCurrentUser: async () => {
    try {
      return await apiRequest<any>("/auth/me");
    } catch {
      return { id: "1", email: "ahmed@edu.com", name: "Ahmed Hassan", role: "student", studentId: "STU-2024-001" };
    }
  },
};

// ─── Course Service ─────────────────────────────────────────
export const courseService = {
  getAvailableCourses: async (semester?: string) => {
    try {
      return await apiRequest<any[]>(`/courses/available?semester=${semester || "current"}`);
    } catch {
      return [];
    }
  },
  getEnrolledCourses: async () => {
    try {
      return await apiRequest<any[]>("/courses/enrolled");
    } catch {
      return [];
    }
  },
  enrollCourse: async (courseId: string) => {
    return apiRequest("/courses/enroll", { method: "POST", body: JSON.stringify({ courseId }) });
  },
  dropCourse: async (courseId: string) => {
    return apiRequest(`/courses/${courseId}/drop`, { method: "POST" });
  },
  checkPrerequisites: async (courseId: string) => {
    try {
      return await apiRequest<{ met: boolean; missing: string[] }>(`/courses/${courseId}/prerequisites`);
    } catch {
      return { met: true, missing: [] };
    }
  },
  checkConflicts: async (courseId: string) => {
    try {
      return await apiRequest<{ hasConflict: boolean; conflictsWith: string[] }>(`/courses/${courseId}/conflicts`);
    } catch {
      return { hasConflict: false, conflictsWith: [] };
    }
  },
};

// ─── Attendance Service ─────────────────────────────────────
export const attendanceService = {
  generateQR: async (lectureId: string) => {
    try {
      return await apiRequest<{ qrCode: string; expiresAt: string }>(`/attendance/qr/generate`, {
        method: "POST",
        body: JSON.stringify({ lectureId }),
      });
    } catch {
      return { qrCode: `QR_${lectureId}_${Date.now()}`, expiresAt: new Date(Date.now() + 300000).toISOString() };
    }
  },
  recordAttendance: async (qrCode: string) => {
    return apiRequest("/attendance/record", { method: "POST", body: JSON.stringify({ qrCode }) });
  },
  getAttendanceHistory: async (courseId?: string) => {
    try {
      return await apiRequest<any[]>(`/attendance/history${courseId ? `?courseId=${courseId}` : ""}`);
    } catch {
      return [];
    }
  },
};

// ─── Faculty Service ────────────────────────────────────────
export const facultyService = {
  uploadMaterial: async (courseId: string, file: File, type: string) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);
    return apiRequest(`/faculty/courses/${courseId}/materials`, { method: "POST", body: formData });
  },
  getGrades: async (courseId: string) => {
    try {
      return await apiRequest<any[]>(`/faculty/courses/${courseId}/grades`);
    } catch {
      return [];
    }
  },
  updateGrade: async (courseId: string, studentId: string, grades: any) => {
    return apiRequest(`/faculty/courses/${courseId}/grades/${studentId}`, {
      method: "PUT",
      body: JSON.stringify(grades),
    });
  },
  getGradeAnalytics: async (courseId: string) => {
    try {
      return await apiRequest<any>(`/faculty/courses/${courseId}/analytics`);
    } catch {
      return { highest: 95, lowest: 42, average: 74.5 };
    }
  },
};

// ─── Student Affairs Service ────────────────────────────────
export const studentAffairsService = {
  submitRequest: async (type: string, data: any) => {
    return apiRequest("/student-affairs/requests", { method: "POST", body: JSON.stringify({ type, ...data }) });
  },
  getRequests: async () => {
    try {
      return await apiRequest<any[]>("/student-affairs/requests");
    } catch {
      return [];
    }
  },
  reviewRequest: async (requestId: string, decision: "approved" | "rejected", notes?: string) => {
    return apiRequest(`/student-affairs/requests/${requestId}/review`, {
      method: "POST",
      body: JSON.stringify({ decision, notes }),
    });
  },
  checkGraduationEligibility: async (studentId: string) => {
    try {
      return await apiRequest<any>(`/student-affairs/graduation/${studentId}`);
    } catch {
      return { eligible: false, completedCredits: 105, requiredCredits: 132, missingCourses: [] };
    }
  },
};

// ─── Recommendation Service ─────────────────────────────────
export const recommendationService = {
  getRecommendations: async (scenario: "improve_gpa" | "finish_courses") => {
    try {
      return await apiRequest<any[]>(`/recommendations?scenario=${scenario}`);
    } catch {
      return [];
    }
  },
  getAcademicAlerts: async () => {
    try {
      return await apiRequest<any[]>("/recommendations/alerts");
    } catch {
      return [];
    }
  },
};

// ─── Timetable Service ──────────────────────────────────────
export const timetableService = {
  getTimetable: async (semester?: string) => {
    try {
      return await apiRequest<any[]>(`/timetable?semester=${semester || "current"}`);
    } catch {
      return [];
    }
  },
};
