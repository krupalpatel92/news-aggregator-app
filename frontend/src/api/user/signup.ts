import api from 'api';
import { useMutation } from '@tanstack/react-query';
import { getAuthSignUpUrl } from 'api/endpoints';
import { SignUpPayload } from './types';
import { useAuth } from 'context/auth/AuthContext';
import { toast } from 'react-toastify';
import { getPersonalFeedSettingPath } from 'route/paths';
import { useHistory } from 'react-router-dom';
import { invalidateArticleSearchQuery } from 'api/article/search';

const useSignUpCall = () => {
	const { setLogin } = useAuth();
	const history = useHistory();

	return useMutation({
		mutationFn: (data: SignUpPayload) => {
			const resData = api
				.post(getAuthSignUpUrl(), data)
				.then(res => {
					const data = res.data;
					setLogin({ accessToken: data.accessToken, expireAt: data.expireAt, user: data.user });
					history.push(getPersonalFeedSettingPath());
					toast.warning('Setup your Feed Preferences to get right news for you.');
					return data;
				})
				.catch(err => {
					const errMsg = err.response?.data?.error;
					return Object.keys(errMsg).reduce((acc, key) => {
						acc[key] = errMsg[key].join(', ');
						toast.error(acc[key]);
						return acc;
					}, {});
				});

			return resData;
		},
		onError: error => {
			console.log(error);
			// Report error to sentry or other service
			// Sentry.captureException(error);
			return error;
		},
	});
};

export default useSignUpCall;
