import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import queryClient from 'api/queryClient';

const QueryProvider = ({ children }) => (
	<QueryClientProvider client={queryClient}>
		{children}
		<ReactQueryDevtools initialIsOpen={false} />
	</QueryClientProvider>
);

export default QueryProvider;
