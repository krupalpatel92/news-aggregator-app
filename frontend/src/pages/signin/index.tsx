import ContentWrapper from 'components/ui-kit/ContentWrapper/ContentWrapper.index';
import SignInForm from 'components/functional/SignInForm/SignInForm.index';

const SignIn: React.FC = () => (
	<ContentWrapper>
		<h1 className='text-center'>Sign In</h1>
		<div className={'col-4 mx-auto'}>
			<SignInForm />
		</div>
	</ContentWrapper>
);

export default SignIn;
