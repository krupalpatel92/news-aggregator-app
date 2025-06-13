/* eslint-disable @typescript-eslint/no-empty-function */
import React, { createContext, useContext, useState, ReactNode, useMemo, useEffect } from 'react';
import Cookies, { CookieAttributes } from 'js-cookie';
import { USER_TOKEN_COOKIE_KEY, USER_PROFILE_COOKIE_KEY } from './constant';
import { UserProfile, LoginAction, AuthContextType } from './types';
import useCheckCookieExpiration from 'utils/hooks/useCheckCookieExpiration';
import queryClient from 'api/queryClient';

const initialContext: AuthContextType = {
	token: undefined,
	isLoggedIn: false,
	userProfile: null,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	setLogin: (param: LoginAction) => {},
	setLogout: () => {},
};

const cookieOptions = (expireAt: string): CookieAttributes => {
	return {
		expires: new Date(expireAt),
		sameSite: 'strict',
		path: '/',
		// secure: true,
	};
};

const AuthContext = createContext<AuthContextType>(initialContext);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	const { isExpired: sessionExpired } = useCheckCookieExpiration(USER_TOKEN_COOKIE_KEY, 3000);

	const [isLoggedIn, setIsLoggedIn] = useState<boolean>(!!Cookies.get(USER_TOKEN_COOKIE_KEY));
	const [userProfile, setUserProfile] = useState<UserProfile | null>(
		JSON.parse(Cookies.get(USER_PROFILE_COOKIE_KEY) || 'null'),
	);
	const [token, setToken] = useState<string | undefined>(Cookies.get(USER_TOKEN_COOKIE_KEY));

	const setLogin = (params: LoginAction) => {
		setIsLoggedIn(true);
		setUserProfile(params.user);
		setToken(params.accessToken);
		Cookies.set(USER_TOKEN_COOKIE_KEY, params.accessToken, cookieOptions(params.expireAt));
		Cookies.set(USER_PROFILE_COOKIE_KEY, JSON.stringify(params.user), cookieOptions(params.expireAt));
	};

	const setLogout = () => {
		setIsLoggedIn(false);
		setUserProfile(null);
		Cookies.remove(USER_TOKEN_COOKIE_KEY);
		Cookies.remove(USER_PROFILE_COOKIE_KEY);
		queryClient.clear();
	};

	useEffect(() => {
		if (sessionExpired) {
			setLogout();
		}
	}, [sessionExpired]);

	const contextValue = useMemo(
		() => ({ isLoggedIn, userProfile, token, setLogin, setLogout }),
		[isLoggedIn, userProfile, token, setLogin, setLogout],
	);

	return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
