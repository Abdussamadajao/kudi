import { Session } from "better-auth";
import { User } from "./user";

export const STORAGE_KEYS = {
  TOKENS: "auth.tokens",
} as const;

// Exported so authStore.ts can import it
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  passwordChangeRequired: boolean;
}

export interface AuthState {
  unverifiedEmail: string | null;
  resetPasswordEmail: string | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  isHydrating: boolean;
  user: User | null;
  session: Session | null;
}

export interface AuthActions {
  logout: () => void;
  setUser: (data: { user: User; session: Session }) => void;
  setUnverifiedEmail: (email: string | null) => void;
  setResetPasswordEmail: (email: string | null) => void;
  hydrate: () => Promise<void>;
}

export type LoginFormValues = {
  username: string;
  password: string;
  device?: string;
};
