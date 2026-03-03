import { useMutation } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import { useAuthStore } from "@/stores/auth-store";

interface LoginResponse {
  access_token: string;
  token_type: string;
}

interface UserResponse {
  id: string;
  email: string;
  created_at: string;
}

// Demo credentials — bypasses API when backend is not connected
const DEMO_ACCOUNTS: Record<string, { password: string; user: UserResponse }> =
  {
    "demo@adlayer.ai": {
      password: "demo2025",
      user: {
        id: "demo-usr-001",
        email: "demo@adlayer.ai",
        created_at: "2025-01-01T00:00:00Z",
      },
    },
  };

function isDemoLogin(email: string, password: string) {
  const account = DEMO_ACCOUNTS[email.toLowerCase().trim()];
  return account && account.password === password ? account : null;
}

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      // Check demo credentials first
      const demo = isDemoLogin(data.email, data.password);
      if (demo) {
        await new Promise((r) => setTimeout(r, 400)); // simulate network
        return {
          access_token: "demo-token-adlayer-2025",
          token_type: "bearer",
          _demoUser: demo.user,
        } as LoginResponse & { _demoUser: UserResponse };
      }
      // Fall through to real API
      const res = await apiClient.post<LoginResponse>("/auth/login", data);
      return res.data;
    },
    onSuccess: async (data) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const demoUser = (data as any)._demoUser as UserResponse | undefined;
      if (demoUser) {
        setAuth(data.access_token, demoUser);
        return;
      }
      const userRes = await apiClient.get<UserResponse>("/auth/me", {
        headers: { Authorization: `Bearer ${data.access_token}` },
      });
      setAuth(data.access_token, userRes.data);
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      // In demo mode, simulate a successful registration
      const isDemo =
        data.email.toLowerCase().trim() === "demo@adlayer.ai";
      if (isDemo) {
        await new Promise((r) => setTimeout(r, 400));
        return DEMO_ACCOUNTS["demo@adlayer.ai"].user;
      }
      const res = await apiClient.post<UserResponse>("/auth/register", data);
      return res.data;
    },
  });
}
