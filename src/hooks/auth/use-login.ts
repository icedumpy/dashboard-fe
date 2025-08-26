import { LOGIN } from "@/contants/api";
import { AuthService } from "@/services/auth-service";
import { useMutation } from "@tanstack/react-query";

export const useLoginAPI = () =>
  useMutation({
    mutationKey: [LOGIN],
    mutationFn: AuthService.login,
  });
