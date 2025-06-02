import { FunctionComponent, useMemo } from 'react';
import useSources from 'api/source/sources';
import sortBy from 'lodash/sortBy';
import styles from './SourcesSelector.module.scss';
import ISourcesSelectorProps from './SourcesSelector.types';
import MultiSelectBox from 'components/ui-kit/MultiSelectBox/MultiSelectBox.index';

const SourcesSelector: FunctionComponent<ISourcesSelectorProps> = ({ defaultValues, onChange }) => {
	const { data: authors, isLoading } = useSources();

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
				name='sources'
				options={options}
				defaultValues={defaultValues}
				onChange={handleChange}
				isLoading={isLoading}
				placeholder='Select sources...'
			/>
		</div>
	);
};

export default SourcesSelector;
