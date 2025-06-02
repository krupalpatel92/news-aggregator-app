import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import classNames from 'classnames';
import styles from './MultiSelectBox.module.scss';
import IMultiSelectProps, { SelectItemType } from './MultiSelectBox.types';

const MultiSelectBox: React.FunctionComponent<IMultiSelectProps> = props => {
	const { name, defaultValues = [], options, isLoading = false, placeholder = 'Select options', onChange } = props;
	const [selectedOptions, setSelectedOptions] = useState<Array<{ value: string | number; label: string }>>([]);

	useEffect(() => {
		if (options && defaultValues) {
			const selected = defaultValues.map(value => {
				const option = options.find(o => o.value === value);
				return option || { value, label: `Item ${value}` };
			});
			setSelectedOptions(selected);
		}
	}, [options, defaultValues]);

	const isOptionDisabled = (option: SelectItemType) =>
		selectedOptions.some(selectedOption => selectedOption.value === option.value);

	const handleChange = options => {
		setSelectedOptions(options);
		onChange?.(options);
	};

	return (
		<div className={styles.wrapper}>
			<Select
				name={name}
				className={classNames(styles.selectMaxWidth, styles.selectMinWidth)}
				placeholder={placeholder}
				isMulti
				value={selectedOptions}
				options={options}
				onChange={handleChange}
				isOptionDisabled={isOptionDisabled}
				isLoading={isLoading}
				isClearable
				isSearchable
			/>
		</div>
	);
};

export default MultiSelectBox;
