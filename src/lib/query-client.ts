import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1, // retry failed requests once
      refetchOnWindowFocus: true, // refetch on window focus
    },
    mutations: {
      retry: false,
    },
  },
});
