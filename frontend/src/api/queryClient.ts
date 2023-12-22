import { QueryClient } from '@tanstack/react-query';

// Create a client
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: true,
			staleTime: 15 * 60 * 1000, // 15 mins
		},
	},
});

export default queryClient;
