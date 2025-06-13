import { useQuery } from '@tanstack/react-query';
import api from 'api';
import { getCategoriesUrl } from 'api/endpoints';
import queryClient from 'api/queryClient';

const CATEGORIES_QUERY_CACHE_KEY = ['categories'] as const;
const categoriesQueryCacheKey = () => [...CATEGORIES_QUERY_CACHE_KEY] as const;

const fetchCategories = async () => await api.get(getCategoriesUrl()).then(res => res.data);

// get list of category
const useCategories = () =>
	useQuery({
		queryKey: categoriesQueryCacheKey(),
		queryFn: async ({ queryKey }) => await fetchCategories(),
	});

// Clear categories list call cache
const invalidateCategoriesQuery = () => queryClient.invalidateQueries({ queryKey: categoriesQueryCacheKey() });

export default useCategories;

export { invalidateCategoriesQuery };
