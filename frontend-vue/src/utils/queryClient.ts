import { QueryClient } from '@tanstack/vue-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // disable automatic refetching when window gains focus
      retry: 1, // retry failed queries once by default
      staleTime: 5 * 60 * 1000, // data is fresh for 5 minutes
    },
  },
})

// Common error handler that can be used across queries
export const handleQueryError = (error: unknown) => {
  // You can implement custom error handling logic here
  console.error('Query error:', error)
  // You might want to show a toast notification or update your error store
}

// Utility function to generate cache keys
export const generateQueryKey = (base: string, params?: Record<string, unknown>) => {
  return params ? [base, params] : [base]
} 