import { FunctionComponent, useMemo } from 'react';
import useAuthors from 'api/author/authors';
import sortBy from 'lodash/sortBy';
import styles from './AuthorsSelector.module.scss';
import IAuthorsSelectorProps from './AuthorsSelector.types';
import MultiSelectBox from 'components/ui-kit/MultiSelectBox/MultiSelectBox.index';

const AuthorsSelector: FunctionComponent<IAuthorsSelectorProps> = ({ defaultValues, onChange }) => {
	const { data: authors, isLoading } = useAuthors();

	const options = useMemo(
		() =>
			sortBy(authors, 'name')?.map(author => ({
				value: author.id,
				label: author.name,
			})),
		[authors],
	);

	const handleChange = options => {
		onChange?.(options.map(option => option.value));
	};

	return (
		<div className={styles.wrapper}>
			<MultiSelectBox
				name='authors'
				options={options}
				defaultValues={defaultValues}
				onChange={handleChange}
				isLoading={isLoading}
				placeholder='Select authors...'
			/>
		</div>
	);
};

export default AuthorsSelector;
