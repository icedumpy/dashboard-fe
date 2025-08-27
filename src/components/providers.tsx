import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { NuqsAdapter } from "nuqs/adapters/react";
import { BrowserRouter } from "react-router-dom";

import { queryClient } from "@/lib/query-client";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        <NuqsAdapter>{children}</NuqsAdapter>
      </QueryClientProvider>
    </BrowserRouter>
  );
}
