import ContentWrapper from 'components/ui-kit/ContentWrapper/ContentWrapper.index';
import { Link } from 'react-router-dom';

const ErrorPage: React.FC = () => (
	<ContentWrapper>
		<div className='error'>
			<div className={'error__hero'}>
				<h1>Oops! Something Went Wrong</h1>
				<h2>
					Please reload the page or go to{' '}
					<u>
						<b>
							<Link to={'/'}>Home Page</Link>
						</b>
					</u>
				</h2>
			</div>
		</div>
	</ContentWrapper>
);

export default ErrorPage;
