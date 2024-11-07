import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { getUrl } from "./socket.ts";
import { trpc } from "./trpc.ts";

const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: getUrl() + "/trpc",
      // You can pass any HTTP headers you wish here
      async headers() {
        return {
          // TODO authentication
          // authorization: getAuthCookie(),
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
        <App />
      </QueryClientProvider>
    </trpc.Provider>
  </StrictMode>
);
