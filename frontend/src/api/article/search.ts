import { useQuery } from '@tanstack/react-query';
import api from 'api';
import { getArticleSearchUrl } from 'api/endpoints';
import queryClient from 'api/queryClient';

export type ArticleSearchQueryParams = {
	keyword?: string;
	limit?: number;
	page?: number;
	start_date?: string;
	end_date?: string;
	source?: string;
	category?: string;
	author?: string;
};

const ARTICLE_SEARCH_QUERY_CACHE_KEY = ['article'] as const;

const articleSearchQueryCacheKey = (params?: ArticleSearchQueryParams) => {
	const queryValues = params
		? Object.entries(params).reduce((acc: any, [key, value]) => {
				return [...acc, key, String(value)];
		  }, [])
		: [];
	return [...ARTICLE_SEARCH_QUERY_CACHE_KEY, queryValues] as const;
};

const fetchArticles = async (queryParam: ArticleSearchQueryParams) =>
	await api.get(getArticleSearchUrl(), { params: { ...queryParam } }).then(res => res.data);

// get list of searched articles
const useArticleSearch = (query: ArticleSearchQueryParams) => {
	// TODO: Limit and Page to be managed later. Good to implement autoload pagination on scroll.
	const queryParam = { ...query, limit: 100, page: 1 };
	return useQuery({
		queryKey: articleSearchQueryCacheKey(queryParam),
		queryFn: async ({ queryKey }) => await fetchArticles(queryParam),
	});
};

// Clear searched article cache
const invalidateArticleSearchQuery = (params?: ArticleSearchQueryParams) =>
	queryClient.invalidateQueries({ queryKey: articleSearchQueryCacheKey(params) });

export default useArticleSearch;

export { invalidateArticleSearchQuery };
