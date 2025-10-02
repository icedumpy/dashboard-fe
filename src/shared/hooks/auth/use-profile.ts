import { useQuery } from "@tanstack/react-query";

import { PROFILE_ENDPOINT } from "@/shared/constants/api";
import { AuthService } from "@/shared/services/auth-service";

export const useProfileAPI = () =>
  useQuery({
    queryKey: [PROFILE_ENDPOINT],
    queryFn: AuthService.getProfile,
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
