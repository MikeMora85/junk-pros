import { QueryClient } from "@tanstack/react-query";

async function handleResponse(response: Response) {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Request failed: ${response.statusText}`);
  }
  return response.json();
}

function getAuthHeaders() {
  const token = localStorage.getItem('auth_token');
  if (token) {
    return {
      'Authorization': `Bearer ${token}`
    };
  }
  return {};
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: async ({ queryKey }) => {
        const response = await fetch(queryKey[0] as string, {
          credentials: 'include',
          headers: {
            ...getAuthHeaders(),
          },
        });
        return handleResponse(response);
      },
      staleTime: 1000 * 60 * 5,
      retry: false,
    },
  },
});

export async function apiRequest(url: string, options?: RequestInit) {
  const response = await fetch(url, {
    ...options,
    credentials: 'include',
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
      ...options?.headers,
    },
  });
  return handleResponse(response);
}
