import styles from './NavigationBar.module.scss';
import { NavLink } from 'react-router-dom';
import INavigationBarItem from './NavigationBar.types';

const NavigationBar: React.FC<INavigationBarItem> = ({ items }) => (
	<nav className={styles.navigationBar}>
		<ul className={styles.menu}>
			{items?.map((menuI, index) => {
				return (
					<li key={`${menuI.name}${index}`} className={styles.menuItem}>
						<NavLink to={menuI.url} exact activeClassName={`${styles.isActive}`}>
							{menuI.name}
						</NavLink>
					</li>
				);
			})}
		</ul>
	</nav>
);
export default NavigationBar;
