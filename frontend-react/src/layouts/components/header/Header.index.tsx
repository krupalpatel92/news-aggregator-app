import styles from './Header.module.scss';
import Logo from 'logo.svg';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { NavigationRoutes } from 'route/Routes';
import NavigationBar from 'components/ui-kit/NavigationBar/NavigationBar.index';
import UserActions from 'components/functional/UserActions/UserActions.index';
import ContentWrapper from 'components/ui-kit/ContentWrapper/ContentWrapper.index';

const Header: React.FC = () => (
	<ContentWrapper>
		<header className={styles.wrapper}>
			<div className={styles.left}>
				<Link className={styles.logoLink} to='/'>
					<img src={Logo} className={classNames('d-inline-block align-top', styles.logoImg)} />
				</Link>
				<div className={styles.menu}>
					<NavigationBar items={NavigationRoutes} />
				</div>
			</div>
			<div className={styles.right}>
				<UserActions />
			</div>
		</header>
	</ContentWrapper>
);
export default Header;
