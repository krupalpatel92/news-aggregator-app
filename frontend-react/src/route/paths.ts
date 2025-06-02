const getSignUpPath = () => '/signup';
const getSignInPath = () => '/signin';
const getProfilePath = () => '/profile';
const getPersonalFeedSettingPath = () => '/personalized-feed/settings';
const getNewsCompanyPath = ({ slug, id }: { slug?: string; id?: string }) =>
	slug && id ? `/news/company/${slug}/:${id}` : `/news/company/:slug/:id`;
const getNewsCompaniesPath = () => '/news/companies';
const getSearchPath = () => '/search';
const getAuthorPath = (slug?: string) => (slug ? `/author/${slug}` : `/author/:slug`);
const getCategoryPath = (slug?: string) => (slug ? `/category/${slug}` : `/category/:slug`);
const getSourcePath = (slug?: string) => (slug ? `/source/${slug}` : `/source/:slug`);

export {
	getSignUpPath,
	getSignInPath,
	getProfilePath,
	getPersonalFeedSettingPath,
	getNewsCompanyPath,
	getNewsCompaniesPath,
	getSearchPath,
	getAuthorPath,
	getCategoryPath,
	getSourcePath,
};
