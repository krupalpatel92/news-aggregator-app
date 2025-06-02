import api from 'api';
import { useMutation } from '@tanstack/react-query';
import { updateUserPreferencesUrl } from 'api/endpoints';
import { FeedPreferencesPayload } from './types';
import { toast } from 'react-toastify';
import { invalidateUserPreferencesQuery } from './preferences';
import { invalidateArticleSearchQuery } from 'api/article/search';

const useFeedPreferencesCall = () =>
	useMutation({
		mutationFn: async (data: FeedPreferencesPayload) => {
			const payload = {
				categoryIds: data.categoryIds?.join(',') || '',
				sourceIds: data.sourceIds?.join(',') || '',
				authorIds: data.authorIds?.join(',') || '',
			};
			const resData = await api
				.post(updateUserPreferencesUrl(), payload)
				.then(res => res.data)
				.catch(err => {
					toast.error(err.response?.data?.message || 'Unable update feed preferences');
				});
			// Update user preferences state by fetching new data
			invalidateUserPreferencesQuery();
			// Refresh the article feed to have a new articles as per fed settings
			invalidateArticleSearchQuery();
			return resData;
		},
		onSuccess: data => {
			toast.success('Feed preferences updated');
			toast.success('Your feed on home page is refreshed as well.');
			return data;
		},
		onError: error => {
			// Report error to sentry or other service
			// Sentry.captureException(error);
			return error;
		},
	});

export default useFeedPreferencesCall;
