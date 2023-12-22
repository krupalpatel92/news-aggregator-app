import { useState, useEffect, useMemo } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import queryString from 'query-string';
import { ArticleSearchQueryParams } from 'api/article/search';

type SearchQueryParams = ArticleSearchQueryParams;

const useSearchQueryParams = () => {
	const history = useHistory();
	const location = useLocation();
	const [currentQueryParams, setCurrentQueryParams] = useState<SearchQueryParams>(() => {
		return queryString.parse(location.search) as unknown as SearchQueryParams;
	});

	useEffect(() => {
		if (location.search === '') {
			setCurrentQueryParams({});
			return;
		}
		const params = queryString.parse(location.search) as unknown as SearchQueryParams;
		setCurrentQueryParams(params);
	}, [location.search]);

	const dateFormating = (date: string) => new Date(date).toISOString().split('T')[0];

	const setUrlQueryParams = (params: Partial<SearchQueryParams>) => {
		const finalParam = { ...currentQueryParams, ...params };
		const paramToUpdate = {
			...finalParam,
			...{
				start_date: finalParam?.start_date ? dateFormating(finalParam.start_date) : undefined,
				end_date: finalParam?.end_date ? dateFormating(finalParam.end_date) : undefined,
			},
		};
		const search = queryString.stringify(paramToUpdate);
		history.push({ pathname: location.pathname, search });
	};

	const clearSearchQuery = () => {
		history.push({ pathname: location.pathname, search: '' });
	};

	return useMemo(
		() => ({ currentQueryParams, setUrlQueryParams, clearSearchQuery, onClearSearchQuery: clearSearchQuery }),
		[currentQueryParams, setUrlQueryParams, clearSearchQuery],
	);
};

export default useSearchQueryParams;
