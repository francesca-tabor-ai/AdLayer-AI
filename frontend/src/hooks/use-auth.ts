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

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const res = await apiClient.post<LoginResponse>("/auth/login", data);
      return res.data;
    },
    onSuccess: async (data) => {
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
      const res = await apiClient.post<UserResponse>("/auth/register", data);
      return res.data;
    },
  });
}
