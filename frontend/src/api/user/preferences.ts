import { useQuery } from '@tanstack/react-query';
import api from 'api';
import { getUserPreferencesUrl } from 'api/endpoints';
import { userId } from './types';
import queryClient from 'api/queryClient';
import { useAuth } from 'context/auth/AuthContext';

const USER_PREFERENCES_QUERY_CACHE_KEY = ['userPreferences'] as const;
const userPreferencesQueryCacheKey = (userId?: userId) => [...USER_PREFERENCES_QUERY_CACHE_KEY, userId] as const;

const fetchUserPreferences = async (userId?: userId) =>
	await api.get(getUserPreferencesUrl(userId)).then(res => res.data);

// get user profile preferences by or without userId current user profile
const useUserPreferences = (preferencesType?: 'feed' | 'notification' | 'email', userId?: userId) => {
	const { isLoggedIn } = useAuth();
	return useQuery({
		queryKey: userPreferencesQueryCacheKey(userId),
		queryFn: async () => {
			const preferences = await fetchUserPreferences(userId);
			return preferencesType ? JSON.parse(preferences[preferencesType]) : preferences;
		},
		enabled: isLoggedIn || Boolean(userId),
	});
};

// Clear cache user profile preferences
const invalidateUserPreferencesQuery = (userId?: userId) =>
	queryClient.invalidateQueries({ queryKey: userPreferencesQueryCacheKey(userId) });

export default useUserPreferences;

export { invalidateUserPreferencesQuery };
