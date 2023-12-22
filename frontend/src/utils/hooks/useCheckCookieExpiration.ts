import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

const useCheckCookieExpiration = (cookieName, interval) => {
	const [cookieValue, setCookieValue] = useState(Cookies.get(cookieName));
	const [isExpired, setIsExpired] = useState(!cookieValue);

	useEffect(() => {
		const intervalId = setInterval(() => {
			const currentCookieValue = Cookies.get(cookieName);
			setCookieValue(currentCookieValue);

			if (!currentCookieValue) {
				setIsExpired(true);
			} else {
				setIsExpired(false);
			}
		}, interval);

		// Cleanup the interval on component unmount
		return () => {
			clearInterval(intervalId);
		};
	}, [cookieName, interval]);

	return { cookieValue, isExpired };
};

export default useCheckCookieExpiration;
