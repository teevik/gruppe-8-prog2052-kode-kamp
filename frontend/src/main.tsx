import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { AuthContextProvider, getAccessToken } from "./auth.tsx";
import "./index.css";
import { getUrl } from "./socket.ts";
import { trpc } from "./trpc.ts";

const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: getUrl() + "/trpc",

      // Add authorization header
      async headers() {
        const token = getAccessToken();
        const authorizationBearer = token ? `Bearer ${token}` : undefined;

        return {
          authorization: authorizationBearer,
        };
      },
    }),
  ],
});

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <AuthContextProvider>
          <App />
        </AuthContextProvider>
      </QueryClientProvider>
    </trpc.Provider>
  </StrictMode>
);
