import { useMutation } from "@tanstack/react-query";

import { LOGIN_ENDPOINT } from "@/constants/api";
import { AuthService } from "@/services/auth-service";

export const useLoginAPI = () =>
  useMutation({
    mutationKey: [LOGIN_ENDPOINT],
    mutationFn: AuthService.login,
  });
