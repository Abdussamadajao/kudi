import { authClient } from "@/lib/auth-client";
import { zustandStorage } from "@/lib/store-manager";
import { AuthActions, AuthState, STORAGE_KEYS, User } from "@/types";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const toUser = (raw: any): User => {
  const fallbackUsername =
    typeof raw?.email === "string" ? raw.email.split("@")[0] : "";

  return {
    id: String(raw?.id ?? ""),
    name: String(raw?.name ?? ""),
    username: String(raw?.username ?? fallbackUsername),
    email: String(raw?.email ?? ""),
    emailVerified: Boolean(raw?.emailVerified),
    avatarUrl: raw?.avatarUrl ?? null,
    bio: raw?.bio ?? null,
    displayUsername: raw?.displayUsername ?? null,
    image: raw?.image ?? null,
    phone: raw?.phone ?? null,
    createdAt:
      raw?.createdAt instanceof Date
        ? raw.createdAt.toISOString()
        : String(raw?.createdAt ?? ""),
    updatedAt:
      raw?.updatedAt instanceof Date
        ? raw.updatedAt.toISOString()
        : String(raw?.updatedAt ?? ""),
  };
};

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      unverifiedEmail: null,
      resetPasswordEmail: null,
      setResetPasswordEmail: (email: string | null) =>
        set((state) => ({ ...state, resetPasswordEmail: email })),
      user: null,
      isAuthenticated: false,
      isHydrated: false,
      isHydrating: true,
      session: null,

      setUnverifiedEmail: (email: string | null) =>
        set((state) => ({ ...state, unverifiedEmail: email })),

      setUser: ({ user, session }) =>
        set((state) => ({
          ...state,
          session,
          user,
          isAuthenticated: true,
        })),

      hydrate: async () => {
        set((state) => ({ ...state, isHydrating: true }));
        try {
          await authClient.getCookie();
          const { data } = await authClient.getSession(); // ← not useSession
          if (data?.user) {
            set((state) => ({
              ...state,
              user: toUser(data.user),
              session: data.session,
              isAuthenticated: true,
            }));
          } else {
            set((state) => ({
              ...state,
              user: null,
              session: null,
              isAuthenticated: false,
            }));
          }
        } catch {
          set((state) => ({
            ...state,
            user: null,
            session: null,
            isAuthenticated: false,
          }));
        } finally {
          set((state) => ({ ...state, isHydrating: false, isHydrated: true }));
        }
      },
      logout: async () => {
        await authClient.signOut();
        set((state) => ({
          ...state,
          user: null,
          session: null,
          isAuthenticated: false,
        }));
      },
    }),
    {
      name: STORAGE_KEYS.TOKENS,
      storage: createJSONStorage(() => zustandStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        session: state.session,
      }),
      onRehydrateStorage: () => (_state, error) => {
        if (error) {
          zustandStorage.removeItem(STORAGE_KEYS.TOKENS);
          useAuthStore.setState({ isAuthenticated: false });
          useAuthStore.setState({ user: null });
        }
        useAuthStore.setState({ isHydrated: true });
      },
    },
  ),
);
