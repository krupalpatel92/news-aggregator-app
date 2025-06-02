import { lazy } from 'react';
import { NavigationBarItem } from 'components/ui-kit/NavigationBar/NavigationBar.types';
import {
	getSignUpPath,
	getSignInPath,
	getProfilePath,
	getPersonalFeedSettingPath,
	getNewsCompanyPath,
	getNewsCompaniesPath,
	getSearchPath,
} from './paths';

const Home = lazy(() => import('pages/home'));
const SignUp = lazy(() => import('pages/signup'));
const SignIn = lazy(() => import('pages/signin'));
const Profile = lazy(() => import('pages/profile'));
const FeedSettings = lazy(() => import('pages/feedSettings'));
const NewsCompany = lazy(() => import('pages/company'));
const NewsCompanyList = lazy(() => import('pages/companyList'));
const Search = lazy(() => import('pages/companyList'));

/**
 * Application Routes
 */
export const RouteItems = [
	{
		path: '/',
		exact: true,
		name: 'home',
		content: Home,
		isProtected: false,
	},
	{
		path: getSignUpPath(),
		exact: true,
		name: 'signup',
		content: SignUp,
		isProtected: false,
	},
	{
		path: getSignInPath(),
		exact: true,
		name: 'signin',
		content: SignIn,
		isProtected: false,
	},
	{
		path: getProfilePath(),
		exact: true,
		name: 'profile',
		content: Profile,
		isProtected: true,
	},
	{
		path: getPersonalFeedSettingPath(),
		exact: true,
		name: 'personalized-feed',
		content: FeedSettings,
		isProtected: true,
	},
	{
		path: getNewsCompanyPath({}),
		exact: true,
		name: 'news-company',
		content: NewsCompany,
		isProtected: false,
	},
	{
		path: getNewsCompaniesPath(),
		exact: true,
		name: 'news-company-list',
		content: NewsCompanyList,
		isProtected: false,
	},
	{
		path: getSearchPath(),
		exact: false,
		name: 'search',
		content: Search,
		isProtected: false,
	},
];

/**
 * Navigation bar Routes
 */
export const NavigationRoutes: NavigationBarItem[] = [
	{
		name: 'News',
		url: '/',
	},
	{
		name: 'Feed Settings',
		url: getPersonalFeedSettingPath(),
	},
];
