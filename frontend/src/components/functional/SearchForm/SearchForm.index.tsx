import React, { FunctionComponent, useEffect, useMemo } from 'react';
import { useFormik } from 'formik';
import DatePicker from 'react-datepicker';
import CategorySelector from 'components/functional/CategorySelector/CategorySelector.index';
import AuthorSelector from 'components/functional/AuthorsSelector/AuthorsSelector.index';
import SourceSelector from 'components/functional/SourcesSelector/SourcesSelector.index';
import 'react-datepicker/dist/react-datepicker.css';
import styles from './SearchForm.module.scss';
import classNames from 'classnames';
import ISearchFormProps from './SearchForm.types';
import useSearchQueryParams from 'utils/hooks/useSearchQueryParams';

const SearchForm: FunctionComponent<ISearchFormProps> = ({ onSubmit }) => {
	const { currentQueryParams, clearSearchQuery } = useSearchQueryParams();

	const defaultValues = useMemo(() => {
		return {
			searchKeyword: currentQueryParams?.keyword || '',
			dateRange: [
				currentQueryParams?.start_date ? new Date(currentQueryParams.start_date) : null,
				currentQueryParams?.end_date ? new Date(currentQueryParams.end_date) : null,
			],
			categories: currentQueryParams?.category?.split(',').map(Number) || [],
			authors: currentQueryParams?.author?.split(',').map(Number) || [],
			sources: currentQueryParams?.source?.split(',').map(Number) || [],
		};
	}, [currentQueryParams]);

	const searchForm = useFormik({
		initialValues: defaultValues,
		onSubmit: values => {
			const sParam = {
				keyword: values.searchKeyword || undefined,
				start_date: values.dateRange[0] ? new Date(values.dateRange[0]).toISOString() : undefined,
				end_date: values.dateRange[1] ? new Date(values.dateRange[1]).toISOString() : undefined,
				source: values.sources.length ? values.sources.join(',') : undefined,
				category: values.categories.length ? values.categories.join(',') : undefined,
				author: values.authors.length ? values.authors.join(',') : undefined,
			};

			onSubmit(sParam);
		},
	});

	useEffect(() => {
		if (!Object.keys(currentQueryParams).length) {
			searchForm.resetForm();
		}
	}, [currentQueryParams]);

	const optionsChoiceHandler = (filedName, values: number[]) => searchForm.setFieldValue(filedName, values);

	return (
		<div className={styles.wrapper}>
			<form onSubmit={searchForm.handleSubmit}>
				<div className={styles.rowFields}>
					<div className={styles.colFieldGroup}>
						<div className='form-group'>
							<input
								type='text'
								className='form-control mr-sm-2'
								id='searchKeyword'
								name='searchKeyword'
								onChange={searchForm.handleChange}
								placeholder='Search by keyword'
								value={searchForm.values.searchKeyword}
							/>
						</div>
					</div>
					<div className={styles.colFieldGroup}>
						<div className='form-group'>
							<DatePicker
								selectsRange
								startDate={searchForm.values.dateRange[0]}
								endDate={searchForm.values.dateRange[1]}
								onChange={update => searchForm.setFieldValue('dateRange', update)}
								isClearable
								maxDate={new Date()}
								dateFormat='yyyy-MM-dd'
								placeholderText='Select a date range'
								className='form-control mr-sm-2'
							/>
						</div>
					</div>

					<div className={styles.colFieldGroup}>
						<div className='form-group'>
							<CategorySelector
								defaultValues={searchForm.values.categories}
								onChange={value => optionsChoiceHandler('categories', value)}
							/>
						</div>
					</div>

					<div className={styles.colFieldGroup}>
						<div className='form-group'>
							<AuthorSelector
								defaultValues={searchForm.values.authors}
								onChange={value => optionsChoiceHandler('authors', value)}
							/>
						</div>
					</div>

					<div className={styles.colFieldGroup}>
						<div className='form-group'>
							<SourceSelector
								defaultValues={searchForm.values.sources}
								onChange={value => optionsChoiceHandler('sources', value)}
							/>
						</div>
					</div>
					<div className={classNames(styles.colFieldGroup, '')}>
						<button type='submit' className='btn btn-primary'>
							Search
						</button>
						<button type='button' className='btn btn-primary' onClick={clearSearchQuery}>
							Clear
						</button>
					</div>
				</div>
			</form>
		</div>
	);
};

export default SearchForm;
