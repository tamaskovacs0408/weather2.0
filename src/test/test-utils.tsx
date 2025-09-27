import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  render,
  renderHook,
  type RenderHookOptions,
  type RenderHookResult,
  type RenderOptions,
} from "@testing-library/react";
import { type ReactElement, type ReactNode } from "react";

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: Infinity,
        refetchOnWindowFocus: false,
      },
    },
  });
}

export function createQueryClientWrapper() {
  const queryClient = createQueryClient();

  return {
    queryClient,
    wrapper: ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    ),
  };
}

export function renderWithQueryClient(
  ui: ReactElement,
  options?: RenderOptions
) {
  const { queryClient, wrapper } = createQueryClientWrapper();

  return {
    queryClient,
    ...render(ui, {
      wrapper,
      ...options,
    }),
  };
}

export function renderHookWithQueryClient<Result, Props>(
  callback: (props: Props) => Result,
  options?: RenderHookOptions<Props>
): RenderHookResult<Result, Props> & { queryClient: QueryClient } {
  const { queryClient, wrapper } = createQueryClientWrapper();

  return {
    queryClient,
    ...renderHook(callback, {
      wrapper,
      ...options,
    }),
  } as RenderHookResult<Result, Props> & { queryClient: QueryClient };
}
