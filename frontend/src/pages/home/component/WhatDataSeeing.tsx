import useUserPreferences from 'api/user/preferences';
import classNames from 'classnames';
import { useAuth } from 'context/auth/AuthContext';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getPersonalFeedSettingPath, getSignInPath } from 'route/paths';
import useSearchQueryParams from 'utils/hooks/useSearchQueryParams';

const WhatDataSeeing: React.FC = () => {
	const { currentQueryParams, clearSearchQuery } = useSearchQueryParams();
	const { isLoggedIn } = useAuth();
	const { data: feedPreferences } = useUserPreferences('feed');

	const msgConditions = useMemo(() => {
		const hasSearch = Object.keys(currentQueryParams).length > 0;
		const hasFeed = feedPreferences && Object.values(feedPreferences).filter(String).length > 0;

		return {
			isGuestFeed: !isLoggedIn && !hasSearch,
			isGeneralFeed: isLoggedIn && !hasFeed && !hasSearch,
			isPersonalFeed: isLoggedIn && hasFeed && !hasSearch,
			isSearchResultFeed: hasSearch,
		};
	}, [isLoggedIn, feedPreferences, currentQueryParams]);

	const alertClass = useMemo(
		() =>
			classNames('alert', {
				'alert-info': msgConditions.isGuestFeed,
				'alert-warning': msgConditions.isGeneralFeed,
				'alert-success': msgConditions.isPersonalFeed,
				'alert-primary': msgConditions.isSearchResultFeed,
			}),
		[msgConditions],
	);

	return (
		<div className={alertClass} role='alert'>
			{msgConditions.isGuestFeed && (
				<>
					You are not logged in. <Link to={getSignInPath()}>Login</Link> to see your feed.
				</>
			)}

			{msgConditions.isGeneralFeed && (
				<>
					You are seeing general feed. Setup <Link to={getPersonalFeedSettingPath()}>feed preferences</Link> to see
					personalized feed.
				</>
			)}

			{msgConditions.isPersonalFeed && (
				<>
					You are seeing personalized feed based on your <Link to={getPersonalFeedSettingPath()}>preferences</Link>.
				</>
			)}

			{msgConditions.isSearchResultFeed && (
				<>
					You are seeing feed based on your search query and filters.{' '}
					<Link onClick={clearSearchQuery}>
						<strong>
							<u>Reset Search Filters</u>
						</strong>
					</Link>
				</>
			)}
		</div>
	);
};

export default WhatDataSeeing;
