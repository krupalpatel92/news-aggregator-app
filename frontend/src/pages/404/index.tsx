import ContentWrapper from 'components/ui-kit/ContentWrapper/ContentWrapper.index';
import { Link } from 'react-router-dom';

const E404: React.FC = () => (
	<ContentWrapper>
		<div>
			Page not found. Go to{' '}
			<Link to='/'>
				<u>Home Page</u>
			</Link>
		</div>
	</ContentWrapper>
);

export default E404;
