import { Route, Redirect } from 'react-router-dom';
import { useAuth } from '../context/auth/AuthContext';
import { getSignInPath } from './paths';

const PrivateRoute = ({ children, ...rest }) => {
	const { isLoggedIn } = useAuth();

	return (
		<Route
			{...rest}
			render={({ location }) =>
				isLoggedIn ? (
					children
				) : (
					<Redirect
						to={{
							pathname: getSignInPath(),
							state: {
								from: location,
								message: { type: 'warning', text: `You need to be logged in to access this "${rest?.name}" page` },
							},
						}}
					/>
				)
			}
		/>
	);
};

export default PrivateRoute;
