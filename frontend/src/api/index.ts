// api.js
import axios from 'axios';
import Cookies from 'js-cookie';
import { USER_TOKEN_COOKIE_KEY } from 'context/auth/constant';
import { getSignInPath } from 'route/paths';
import API_BASE_URL from './endpoints';

const api = axios.create({
	baseURL: API_BASE_URL,
	timeout: 10000,
	headers: {
		Accept: 'application/json',
		'Content-Type': 'application/json',
	},
});

// Add a response interceptor
api.interceptors.response.use(
	response => {
		return response;
	},
	error => {
		// Check if it's a token expiration error
		if (error.response && error.response.status === 401 && !error.response.responseUrl.includes(getSignInPath())) {
			Cookies.remove(USER_TOKEN_COOKIE_KEY);
			window.location.href = getSignInPath();
		}
		return Promise.reject(error);
	},
);

// Add a request interceptor
api.interceptors.request.use(
	config => {
		const token = Cookies.get(USER_TOKEN_COOKIE_KEY);
		if (token) {
			config.headers['Authorization'] = `Bearer ${token}`;
		}
		return config;
	},
	error => {
		// Do something with request error
		return Promise.reject(error);
	},
);

export default api;
