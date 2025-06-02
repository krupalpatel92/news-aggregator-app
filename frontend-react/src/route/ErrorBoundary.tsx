import { Component, ErrorInfo, ReactNode } from 'react';
import ErrorPage from 'pages/error';

interface IProps {
	children: ReactNode;
}

interface IState {
	hasError: boolean;
}

class ErrorBoundary extends Component<IProps, IState> {
	public state: IState = {
		hasError: false,
	};

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public static getDerivedStateFromError(_: Error): IState {
		// Update state so the next render will show the fallback UI.
		return { hasError: true };
	}

	public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		console.error('Uncaught error:', error, errorInfo);
	}

	public render() {
		if (this.state.hasError) {
			return <ErrorPage />;
		}

		return this.props.children;
	}
}

export default ErrorBoundary;
