export type NewsMeta = {
	id: number | string;
	name: string;
	slug: string;
};

export type NewsItem = {
	id: number | string;
	name: string;
	slug: string;
	publishedAt: string;
	URL: string;
	imgUrl: string | null;
	summary: string | null;
	author: NewsMeta;
	source: NewsMeta;
	category: NewsMeta;
};
