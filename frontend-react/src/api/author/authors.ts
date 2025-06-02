import { useQuery } from '@tanstack/react-query';
import api from 'api';
import { getAuthorsUrl } from 'api/endpoints';
import queryClient from 'api/queryClient';

const AUTHORS_QUERY_CACHE_KEY = ['authors'] as const;
const authorsQueryCacheKey = () => [...AUTHORS_QUERY_CACHE_KEY] as const;

const fetchAuthors = async () => await api.get(getAuthorsUrl()).then(res => res.data);

// get list of authors
const useAuthors = () =>
	useQuery({
		queryKey: authorsQueryCacheKey(),
		queryFn: async ({ queryKey }) => await fetchAuthors(),
	});

// Clear categories list call cache
const invalidateAuthorsQuery = () => queryClient.invalidateQueries({ queryKey: authorsQueryCacheKey() });

export default useAuthors;

export { invalidateAuthorsQuery };
