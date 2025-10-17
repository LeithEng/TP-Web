export interface AuthState {
  userId: number | null;
  email: string | null;
  isAuthenticated: boolean;
}