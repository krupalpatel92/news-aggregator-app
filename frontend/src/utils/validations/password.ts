import * as Yup from 'yup';

const password = Yup.string()
	.required('Password is required, please enter a password')
	.min(6, 'Password must be at least 6 characters long')
	.matches(
		/^(?=.*[!@#$&_.#])(?=.*[A-Z])(?=.*[a-z])(?=.*\d)/,
		'Should include uppercase, lowercase, number, special character (@, $, &, _, #, .)',
	);

export const confirmPassword = Yup.string()
	.oneOf([Yup.ref('password'), ''], 'Passwords must match')
	.required('Please confirm your password');

export default password;
