import ContentWrapper from 'components/ui-kit/ContentWrapper/ContentWrapper.index';
import SignUpForm from 'components/functional/SignUpForm/SignUpForm.index';

const SignUp: React.FC = () => (
	<ContentWrapper>
		<h1 className='text-center'>Sign Up</h1>
		<div className={'col-4 mx-auto'}>
			<SignUpForm />
		</div>
	</ContentWrapper>
);

export default SignUp;
