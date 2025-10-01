import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1, // retry failed requests once
      refetchOnWindowFocus: true, // refetch on window focus
      staleTime: 5 * 60 * 1000, // data is fresh for 5 minutes
    },
    mutations: {
      retry: false,
    },
  },
});
