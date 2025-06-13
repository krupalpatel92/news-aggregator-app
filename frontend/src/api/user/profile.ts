import { useQuery } from '@tanstack/react-query';
import api from 'api';
import { getUserProfileUrl } from 'api/endpoints';
import { userId } from './types';
import queryClient from 'api/queryClient';

const PROFILE_QUERY_CACHE_KEY = ['profile'] as const;
const profileQueryCacheKey = (userId?: userId) => [...PROFILE_QUERY_CACHE_KEY, userId] as const;

const fetchProfile = async (userId?: userId) => await api.get(getUserProfileUrl(userId));

// get user profile by or without userId current user profile
const useProfile = (userId?: userId) =>
	useQuery({
		queryKey: profileQueryCacheKey(userId),
		queryFn: async ({ queryKey }) => await fetchProfile(userId),
	});

// Clear cache user profile call cache
const invalidateProfileQuery = (userId?: userId) =>
	queryClient.invalidateQueries({ queryKey: profileQueryCacheKey(userId) });

export default useProfile;

export { invalidateProfileQuery };
