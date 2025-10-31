export type UserRole = "admin" | "sales" | "tech";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
}
