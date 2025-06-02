import styles from './UserActions.module.scss';
import { Link } from 'react-router-dom';
import Icons from 'components/ui-kit/Icons/Icons.index';
import { useAuth } from 'context/auth/AuthContext';
import { getSignInPath, getSignUpPath } from 'route/paths';

const UserActions: React.FC = () => {
	const { isLoggedIn, setLogout, userProfile } = useAuth();
	return (
		<div className={styles.userActions}>
			{!isLoggedIn && (
				<>
					<Link to={getSignInPath()}>
						<Icons name='fa-solid fa-user-plus' />
						SignIn
					</Link>
					<Link to={getSignUpPath()}>
						<Icons name='fa-solid fa-user-group' />
						SignUp
					</Link>
				</>
			)}
			{isLoggedIn && (
				<>
					Hello, {userProfile?.name} |
					<button className='btn' onClick={setLogout}>
						<Icons name='fa-solid fa-power-off' /> Logout
					</button>
				</>
			)}
		</div>
	);
};
export default UserActions;
