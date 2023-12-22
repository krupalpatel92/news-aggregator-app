import React from 'react';
import { useFormik } from 'formik';
import { object as yupObject } from 'yup';
import { fullName, email, password, termsCondition } from 'utils/validations';
import { Link } from 'react-router-dom';
import styles from './SignUpForm.module.scss';
import classNames from 'classnames';
import useSignUpCall from 'api/user/signup';
import { omit } from 'lodash';

const SignUpForm: React.FC = () => {
	const { mutate: signUpCall, isPending: signingUp, isError: signUpError } = useSignUpCall();

	const signUpForm = useFormik({
		initialValues: {
			name: '',
			email: '',
			password: '',
			confirmPassword: '',
			agreed: false,
		},
		validationSchema: yupObject({
			name: fullName,
			email: email,
			password: password.default,
			confirmPassword: password.confirmPassword,
			agreed: termsCondition,
		}),
		onSubmit: values => {
			signUpCall(omit(values, ['confirmPassword', 'agreed']));
		},
	});

	return (
		<form onSubmit={signUpForm.handleSubmit} className='container mt-5'>
			<div className='form-group mb-4 position-relative'>
				<label htmlFor='email'>Name:</label>
				{/* TODO: Should be a state less component to follow DRY standard */}
				<input
					type='text'
					id='name'
					name='name'
					className={`form-control ${signUpForm.touched.name && signUpForm.errors.name ? 'is-invalid' : ''}`}
					onChange={signUpForm.handleChange}
					value={signUpForm.values.name}
				/>
				{signUpForm.touched.name && signUpForm.errors.name ? (
					<div className={classNames('invalid-feedback position-absolute', styles.errorPosition)}>
						{signUpForm.errors.name}
					</div>
				) : null}
			</div>

			<div className='form-group mb-4 position-relative'>
				<label htmlFor='email'>Email:</label>
				<input
					type='email'
					id='email'
					name='email'
					className={`form-control ${signUpForm.touched.email && signUpForm.errors.email ? 'is-invalid' : ''}`}
					onChange={signUpForm.handleChange}
					value={signUpForm.values.email}
				/>
				{signUpForm.touched.email && signUpForm.errors.email ? (
					<div className={classNames('invalid-feedback position-absolute', styles.errorPosition)}>
						{signUpForm.errors.email}
					</div>
				) : null}
			</div>

			<div className='form-group mb-4 position-relative'>
				<label htmlFor='password'>Password:</label>
				<input
					type='password'
					id='password'
					name='password'
					className={`form-control ${signUpForm.touched.password && signUpForm.errors.password ? 'is-invalid' : ''}`}
					onChange={signUpForm.handleChange}
					value={signUpForm.values.password}
				/>
				{signUpForm.touched.password && signUpForm.errors.password ? (
					<div className={classNames('invalid-feedback position-absolute', styles.errorPosition)}>
						{signUpForm.errors.password}
					</div>
				) : null}
			</div>

			<div className='form-group mb-4 position-relative'>
				<label htmlFor='confirmPassword'>Confirm Password:</label>
				<input
					type='password'
					id='confirmPassword'
					name='confirmPassword'
					className={`form-control ${
						signUpForm.touched.confirmPassword && signUpForm.errors.confirmPassword ? 'is-invalid' : ''
					}`}
					onChange={signUpForm.handleChange}
					value={signUpForm.values.confirmPassword}
				/>
				{signUpForm.touched.confirmPassword && signUpForm.errors.confirmPassword ? (
					<div className={classNames('invalid-feedback position-absolute', styles.errorPosition)}>
						{signUpForm.errors.confirmPassword}
					</div>
				) : null}
			</div>

			<div className='form-group mb-4 position-relative'>
				<input
					type='checkbox'
					id='agreed'
					name='agreed'
					className={`form-check-input ${signUpForm.touched.agreed && signUpForm.errors.agreed ? 'is-invalid' : ''}`}
					onChange={signUpForm.handleChange}
					checked={signUpForm.values.agreed}
				/>
				<label htmlFor='agreed' className='form-check-label mx-2'>
					Agreed with <Link to='/terms-conditions'>Terms & Conditions</Link> and{' '}
					<Link to='privacy-policy'>Privacy Policy</Link>
				</label>
				{signUpForm.touched.agreed && signUpForm.errors.agreed ? (
					<div className={classNames('invalid-feedback position-absolute', styles.errorPosition)}>
						{signUpForm.errors.agreed}
					</div>
				) : null}
			</div>

			<div>
				<button type='submit' className='btn btn-primary' disabled={signingUp}>
					{signingUp ? 'Signing Up...' : 'Sign Up'}
				</button>
				<Link to='/signin' className='mx-3'>
					Already have an account?
				</Link>
			</div>
		</form>
	);
};

export default SignUpForm;
