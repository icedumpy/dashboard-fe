import { useQuery } from "@tanstack/react-query";

import { PROFILE } from "@/contants/api";
import { AuthService } from "@/services/auth-service";

export const useProfileAPI = () =>
  useQuery({
    queryKey: [PROFILE],
    queryFn: AuthService.getProfile,
  });
