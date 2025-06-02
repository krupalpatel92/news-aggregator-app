import { ArticleSearchQueryParams } from 'api/article/search';

export default interface ISearchFormProps {
	onSubmit: (keyword: ArticleSearchQueryParams) => void;
}
