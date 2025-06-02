import { lazy, Suspense } from 'react';
import Content from './components/content/Content.index';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { RouteItems } from 'route/Routes';
import ErrorBoundary from 'route/ErrorBoundary';
import styles from './Layouts.module.scss';
import Header from './components/header/Header.index';
import PrivateRoute from 'route/PrivateRoute';
const E404 = lazy(() => import('pages/404'));

const Layout: React.FC = () => (
	<BrowserRouter>
		<div className={styles.layout}>
			<Content>
				<Header />
				<Suspense>
					<ErrorBoundary>
						<Switch>
							{RouteItems.map(route => (
								<Route key={`root.${route.name}`} exact={route.exact} path={route.path}>
									{route.isProtected ? (
										<PrivateRoute {...route}>
											<route.content />
										</PrivateRoute>
									) : (
										<route.content />
									)}
								</Route>
							))}
							<Route>
								<E404 />
							</Route>
						</Switch>
					</ErrorBoundary>
				</Suspense>
			</Content>
		</div>
	</BrowserRouter>
);

export default Layout;
