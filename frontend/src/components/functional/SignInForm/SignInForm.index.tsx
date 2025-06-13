import React from 'react';
import { useFormik } from 'formik';
import { object as yupObject } from 'yup';
import { email, password } from 'utils/validations';
import { Link } from 'react-router-dom';
import styles from './SignInForm.module.scss';
import classNames from 'classnames';
import { useLocation } from 'react-router-dom';
import useSigninCall from 'api/user/signin';
import { omit } from 'lodash';

const SignInForm: React.FC = () => {
	const { state: urlState } = useLocation();

	const { mutate: signInCall, isPending: isSigning, isError } = useSigninCall();

	const signInForm = useFormik({
		initialValues: {
			email: '',
			password: '',
			rememberMe: false,
		},
		validationSchema: yupObject({
			email: email,
			password: password.default,
		}),
		onSubmit: values => {
			// TODO: Has to manage remember me later
			signInCall(omit(values, 'rememberMe'));
		},
	});

	return (
		<div className={styles.wrapper}>
			{urlState && urlState.message && (
				<div className={`alert alert-${urlState.message.type ?? 'info'} alert-dismissible fade show`} role='alert'>
					{urlState.message.text}
					<button type='button' className='btn-close' data-bs-dismiss='alert' aria-label='Close'></button>
				</div>
			)}

			<form onSubmit={signInForm.handleSubmit} className='container mt-5'>
				<div className='form-group mb-4 position-relative'>
					<label htmlFor='email'>Email:</label>
					<input
						type='email'
						id='email'
						name='email'
						className={`form-control ${signInForm.touched.email && signInForm.errors.email ? 'is-invalid' : ''}`}
						onChange={signInForm.handleChange}
						value={signInForm.values.email}
					/>
					{signInForm.touched.email && signInForm.errors.email ? (
						<div className={classNames('invalid-feedback position-absolute', styles.errorPosition)}>
							{signInForm.errors.email}
						</div>
					) : null}
				</div>

				<div className='form-group mb-4 position-relative'>
					<label htmlFor='password'>Password:</label>
					<input
						type='password'
						id='password'
						name='password'
						className={`form-control ${signInForm.touched.password && signInForm.errors.password ? 'is-invalid' : ''}`}
						onChange={signInForm.handleChange}
						value={signInForm.values.password}
					/>
					{signInForm.touched.password && signInForm.errors.password ? (
						<div className={classNames('invalid-feedback position-absolute', styles.errorPosition)}>
							{signInForm.errors.password}
						</div>
					) : null}
				</div>

				<div className='form-group form-check mb-4'>
					<input
						type='checkbox'
						id='rememberMe'
						name='rememberMe'
						className='form-check-input'
						onChange={signInForm.handleChange}
						checked={signInForm.values.rememberMe}
					/>
					<label htmlFor='rememberMe' className='form-check-label'>
						Remember Me
					</label>
				</div>

				<div>
					<button type='submit' className='btn btn-primary'>
						Sign In
					</button>
					<Link to='/signup' className='mx-3'>
						Don&apos;t have an account?
					</Link>
				</div>

				{!isSigning && isError && (
					<div className='alert alert-danger mt-3' role='alert'>
						Wrong Credentials
					</div>
				)}
			</form>
		</div>
	);
};

export default SignInForm;
