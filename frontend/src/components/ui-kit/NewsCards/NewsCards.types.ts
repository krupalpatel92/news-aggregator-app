import { NewsItem } from 'api/article/types';

export enum NewsCardType {
	EXTRA_LARGE = 'xl',
	LARGE = 'lg',
	MEDIUM = 'md',
	SMALL = 'sm',
}

export interface INewsCard {
	type: NewsCardType;
	data: NewsItem;
}
