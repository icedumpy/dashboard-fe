import { useMutation } from "@tanstack/react-query";

import { LOGIN_ENDPOINT } from "@/shared/constants/api";
import { AuthService } from "@/shared/services/auth-service";

export const useLoginAPI = () =>
  useMutation({
    mutationKey: [LOGIN_ENDPOINT],
    mutationFn: AuthService.login,
  });
