import { useMemo, useCallback } from 'react';
import { useFormik } from 'formik';
import useCategories from 'api/category/categories';
import { FormValues } from './FeedPreferencesForm.types';
import styles from './FeedPreferencesForm.module.scss';
import useFeedPreferencesCall from 'api/user/feedPreferences';
import useUserPreferences from 'api/user/preferences';
import CategorySelector from 'components/functional/CategorySelector/CategorySelector.index';
import AuthorsSelector from 'components/functional/AuthorsSelector/AuthorsSelector.index';
import SourcesSelector from 'components/functional/SourcesSelector/SourcesSelector.index';
import useSources from 'api/source/sources';
import useAuthors from 'api/author/authors';

const FeedPreferences = () => {
	const { data: categories } = useCategories();
	const { data: sources } = useSources();
	const { data: authors } = useAuthors();
	const { data: preferences } = useUserPreferences('feed');
	const { mutate: saveFeedPreferences, isPending: isSavingFeedPreferences } = useFeedPreferencesCall();

	const preferencesForm = useFormik<FormValues>({
		initialValues: {
			categories: [],
			authors: [],
			sources: [],
		},
		onSubmit: values => {
			saveFeedPreferences({
				categoryIds: values?.categories ?? [],
				sourceIds: values.sources ?? [],
				authorIds: values.authors ?? [],
			});
		},
	});

	const feedPreferences = useMemo(() => {
		const feedPreferences = {
			categories: (preferences?.categoryIds || '').split(',').map(Number).filter(Number),
			sources: (preferences?.sourceIds || '').split(',').map(Number).filter(Number),
			authors: (preferences?.authorIds || '').split(',').map(Number).filter(Number),
		};

		preferencesForm.setFieldValue('categories', feedPreferences?.categories);
		preferencesForm.setFieldValue('authors', feedPreferences?.authors);
		preferencesForm.setFieldValue('sources', feedPreferences?.sources);

		return feedPreferences;
	}, [preferences]);

	const optionsChoiceHandler = useCallback(
		(filedName: keyof FormValues, values: number[]) => preferencesForm.setFieldValue(filedName, values),
		[],
	);

	return (
		<div className='mt-4'>
			<h1 className='mb-5'>News Feed Preferences</h1>
			<form onSubmit={preferencesForm.handleSubmit}>
				<div className='mb-5'>
					<label className='d-block mb-1'>
						<strong>Categories</strong>
						<span className={styles.counting}>
							(Selected {preferencesForm.values?.categories?.length} / {categories?.length})
						</span>
					</label>
					<div className='d-flex flex-wrap'>
						<CategorySelector
							defaultValues={feedPreferences?.categories}
							onChange={value => optionsChoiceHandler('categories', value)}
						/>
					</div>
				</div>
				<div className='mb-5'>
					<label className='d-block mb-1'>
						<strong>Sources</strong>
						<span className={styles.counting}>
							(Selected {preferencesForm.values?.sources?.length} / {sources?.length})
						</span>
					</label>
					<div className='d-flex flex-wrap'>
						<SourcesSelector
							defaultValues={feedPreferences?.sources}
							onChange={value => optionsChoiceHandler('sources', value)}
						/>
					</div>
				</div>
				<div className='mb-5'>
					<label className='d-block mb-1'>
						<strong>Authors</strong>
						<span className={styles.counting}>
							(Selected {preferencesForm.values?.authors?.length} / {authors?.length})
						</span>
					</label>
					<div className='d-flex flex-wrap'>
						<AuthorsSelector
							defaultValues={feedPreferences?.authors}
							onChange={value => optionsChoiceHandler('authors', value)}
						/>
					</div>
				</div>

				<button type='submit' className='btn btn-primary' disabled={isSavingFeedPreferences}>
					{isSavingFeedPreferences ? 'Saving Feed Preferences...' : 'Save Feed Preferences'}
				</button>
			</form>
		</div>
	);
};

export default FeedPreferences;
