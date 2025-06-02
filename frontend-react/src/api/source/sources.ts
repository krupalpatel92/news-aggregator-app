import { useQuery } from '@tanstack/react-query';
import api from 'api';
import { getSourcesUrl } from 'api/endpoints';
import queryClient from 'api/queryClient';

const SOURCES_QUERY_CACHE_KEY = ['sources'] as const;
const sourcesQueryCacheKey = () => [...SOURCES_QUERY_CACHE_KEY] as const;

const fetchSources = async () => await api.get(getSourcesUrl()).then(res => res.data);

// get list of sources
const useSources = () =>
	useQuery({
		queryKey: sourcesQueryCacheKey(),
		queryFn: async ({ queryKey }) => await fetchSources(),
	});

// Clear categories list call cache
const invalidateSourcesQuery = () => queryClient.invalidateQueries({ queryKey: sourcesQueryCacheKey() });

export default useSources;

export { invalidateSourcesQuery };
