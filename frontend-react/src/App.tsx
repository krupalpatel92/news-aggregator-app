import React from 'react';
import Layout from 'layouts/Layout.index';
import { AuthProvider } from './context/auth/AuthContext';
import QueryProvider from 'api/QueryProvider';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/**
 * TODO: Add Redux Toolkit wrapper to <Layout> here to provide store to the app.
 * It depends on the project need.
 * Some uses Redux, some uses Context API, some uses ReactQuery, and custom hooks.
 **/

const App: React.FC = () => (
	<QueryProvider>
		<AuthProvider>
			<Layout />
			<ToastContainer autoClose={5000} theme='light' position='top-right' pauseOnHover closeOnClick newestOnTop />
		</AuthProvider>
	</QueryProvider>
);

export default App;
