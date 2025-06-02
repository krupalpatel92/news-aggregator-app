export type SelectItemType = { value: string | number; label: string };

export default interface IMultiSelectBoxProps {
	name: string;
	defaultValues?: string[] | number[];
	options: SelectItemType[];
	isLoading?: boolean;
	placeholder?: string;
	onChange: (selectedValues: SelectItemType[]) => void;
}
