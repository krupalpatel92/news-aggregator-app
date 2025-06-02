import api from 'api';
import { useMutation } from '@tanstack/react-query';
import { getAuthSignInUrl } from 'api/endpoints';
import { SignInPayload } from './types';
import { useAuth } from 'context/auth/AuthContext';
import { toast } from 'react-toastify';
import { getPersonalFeedSettingPath } from 'route/paths';
import { useHistory } from 'react-router-dom';
import { invalidateArticleSearchQuery } from 'api/article/search';

const useSignInCall = () => {
	const { setLogin } = useAuth();
	const history = useHistory();

	return useMutation({
		mutationFn: (data: SignInPayload) => {
			const resData = api
				.post(getAuthSignInUrl(), data)
				.then(res => {
					const data = res.data;
					setLogin({ accessToken: data.accessToken, expireAt: data.expireAt, user: data.user });
					history.push(getPersonalFeedSettingPath());
				})
				.catch(err => {
					toast.error('Invalid email or password');
				});

			// Refresh home page feed to have article as per feed settings
			invalidateArticleSearchQuery();
			toast.info('Your feed is refreshed as per settings.');

			return resData;
		},
		onError: error => {
			// Report error to sentry or other service
			// Sentry.captureException(error);
			return error;
		},
	});
};

export default useSignInCall;
