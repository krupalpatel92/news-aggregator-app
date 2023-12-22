import { FunctionComponent, useMemo } from 'react';
import useCategories from 'api/category/categories';
import sortBy from 'lodash/sortBy';
import styles from './CategorySelector.module.scss';
import ICategorySelectorProps from './CategorySelector.types';
import MultiSelectBox from 'components/ui-kit/MultiSelectBox/MultiSelectBox.index';

const CategorySelector: FunctionComponent<ICategorySelectorProps> = ({ defaultValues, onChange }) => {
	const { data: categories, isLoading } = useCategories();

	const options = useMemo(
		() =>
			sortBy(categories, 'name')?.map(category => ({
				value: category.id,
				label: category.name,
			})),
		[categories],
	);

	const handleChange = options => {
		onChange?.(options.map(option => option.value));
	};

	return (
		<div className={styles.wrapper}>
			<MultiSelectBox
				name='categories'
				options={options}
				defaultValues={defaultValues}
				onChange={handleChange}
				isLoading={isLoading}
				placeholder='Select categories...'
			/>
		</div>
	);
};

export default CategorySelector;
