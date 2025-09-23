import { useQuery } from "@tanstack/react-query";

import { PROFILE_ENDPOINT } from "@/constants/api";
import { AuthService } from "@/services/auth-service";

export const useProfileAPI = () =>
  useQuery({
    queryKey: [PROFILE_ENDPOINT],
    queryFn: AuthService.getProfile,
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
