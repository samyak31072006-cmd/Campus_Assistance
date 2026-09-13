export type UserRole = "STUDENT" | "CREATOR" | "ADMIN";

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  rollNumber?: string;
  branch?: string;
  section?: string;
  collegeName?: string;
}

export const DEMO_USERS: Record<UserRole, CurrentUser> = {
  STUDENT: {
    id: "user-student-1",
    name: "Rohan Sharma",
    email: "rohan.sharma@campus.edu",
    phone: "+91 98765 43210",
    role: "STUDENT",
    rollNumber: "21BCE1042",
    branch: "Computer Science & Engg",
    section: "CS-B",
    collegeName: "Main Campus Engineering College",
  },
  CREATOR: {
    id: "user-creator-1",
    name: "Aman Verma (Creator)",
    email: "aman.creator@campus.edu",
    phone: "+91 98123 45678",
    role: "CREATOR",
    collegeName: "Main Campus Engineering College",
  },
  ADMIN: {
    id: "user-admin-1",
    name: "Campus Ops Admin",
    email: "admin@campusassistance.in",
    phone: "+91 99999 88888",
    role: "ADMIN",
    collegeName: "Main Campus Engineering College",
  },
};

export function getCurrentUserRoleFromCookies(cookieString?: string): UserRole {
  if (!cookieString) return "STUDENT";
  if (cookieString.includes("demo_role=ADMIN")) return "ADMIN";
  if (cookieString.includes("demo_role=CREATOR")) return "CREATOR";
  return "STUDENT";
}

export function getCurrentUser(role: UserRole = "STUDENT"): CurrentUser {
  return DEMO_USERS[role] || DEMO_USERS.STUDENT;
}
