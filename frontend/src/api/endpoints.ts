// NOTE: Should be from ENV file or managed within deployment pipeline. As of now hard coded.
const API_BASE_URL = 'http://127.0.0.1:8000/api';

// Auth endpoints
const getAuthSignInUrl = () => '/auth/signin';
const getAuthSignUpUrl = () => '/auth/signup';

// User endpoints
const getUserProfileUrl = (userId?: string | number) => `/user/${userId ?? 'me'}/profile`;
const getUserPreferencesUrl = (userId?: string | number) => `/user/${userId ?? 'me'}/preferences`;
const updateUserPreferencesUrl = (userId?: string | number) => `/user/${userId ?? 'me'}/preferences/feed`;

// Category endpoints
const getCategoriesUrl = () => `/news/categories`;

// Sources endpoints
const getSourcesUrl = () => `/news/sources`;

// Authors endpoints
const getAuthorsUrl = () => `/news/authors`;

// Article endpoints
const getArticleSearchUrl = () => `/news/articles/search`;

// Exports
export default API_BASE_URL;

export {
	getAuthSignInUrl,
	getAuthSignUpUrl,
	getUserProfileUrl,
	getUserPreferencesUrl,
	updateUserPreferencesUrl,
	getCategoriesUrl,
	getSourcesUrl,
	getAuthorsUrl,
	getArticleSearchUrl,
};
