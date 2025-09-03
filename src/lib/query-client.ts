import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      refetchInterval: 60 * 1000, // 1 minute
      refetchOnWindowFocus: true, // refetch on window focus
    },
    mutations: {
      retry: false,
    },
  },
});
