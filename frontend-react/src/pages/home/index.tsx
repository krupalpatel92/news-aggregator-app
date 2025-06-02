import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import SearchForm from 'components/functional/SearchForm/SearchForm.index';
import ContentWrapper from 'components/ui-kit/ContentWrapper/ContentWrapper.index';
import NewsCard from 'components/ui-kit/NewsCards/NewsCards.index';
import { NewsCardType } from 'components/ui-kit/NewsCards/NewsCards.types';
import useSearchQueryParams from 'utils/hooks/useSearchQueryParams';
import useArticleSearch from 'api/article/search';
import DecayingView from 'components/helper/DecayingView/DecayingView.index';
import useCategories from 'api/category/categories';
import useAuthors from 'api/author/authors';
import useSources from 'api/source/sources';
import { getAuthorPath, getCategoryPath, getSourcePath } from 'route/paths';
import WhatDataSeeing from './component/WhatDataSeeing';

const Home: React.FC = () => {
	const { currentQueryParams, setUrlQueryParams } = useSearchQueryParams();
	const { data: articleSearchResult, isLoading } = useArticleSearch(currentQueryParams);
	const { data: categories } = useCategories();
	const { data: authors } = useAuthors();
	const { data: sources } = useSources();

	const { data: articleData, meta } = useMemo(
		() => articleSearchResult || { data: [], meta: {} },
		[articleSearchResult],
	);

	const newsForSmallCard = useMemo(() => articleData?.slice(1, 6) || [], [articleData]);
	const newsForLargeCard = useMemo(() => articleData?.slice(6, 8) || [], [articleData]);
	const newsForMediumCard = useMemo(() => articleData?.slice(8) || [], [articleData]);

	return (
		<ContentWrapper>
			<WhatDataSeeing />
			<div className='row mb-4'>
				<div className='col'>
					<SearchForm onSubmit={setUrlQueryParams} />
				</div>
			</div>
			<DecayingView isVisible={isLoading}>
				<div className='row'>
					{/* TODO: Can place a loading skeleton to have batter user experience */}
					<p className='text-center'>Fetching news articles...</p>
				</div>
			</DecayingView>
			<DecayingView isVisible={articleData?.length > 0 && !isLoading}>
				<div className='row'>
					<div className='col-lg-8 mb-4'>
						{articleData && <NewsCard type={NewsCardType.EXTRA_LARGE} data={articleData[0]} />}
					</div>

					<div className='col-lg-4'>
						{newsForSmallCard?.map((article, key) => (
							<div key={`${article.slug}-${key}`} className='mb-3'>
								<NewsCard type={NewsCardType.SMALL} data={article} />
							</div>
						))}
					</div>
				</div>
				<div className='row'>
					<div className='col-lg-8'>
						<div className='row mb-3'>
							{newsForLargeCard?.map((article, key) => (
								<div key={`${article.slug}-${key}`} className='col-md-6'>
									<NewsCard type={NewsCardType.LARGE} data={article} />
								</div>
							))}
						</div>
						{newsForMediumCard?.map((article, key) => (
							<div key={`${article.slug}-${key}`} className='mb-3'>
								<NewsCard type={NewsCardType.MEDIUM} data={article} />
							</div>
						))}
					</div>
					<div className='col-lg-4'>
						<div className='mb-5'>
							<h3 className='mb-3'>Categories ({categories?.length})</h3>
							<p>
								{categories?.map(category => (
									<Link key={category.slug} to={getCategoryPath(category.slug)}>
										<span className='badge bg-primary m-1'>{category.name}</span>
									</Link>
								))}
							</p>
						</div>
						<div className='mb-5'>
							<h3 className='mb-3'>Sources ({sources?.length})</h3>
							<p>
								{sources?.map(source => (
									<Link key={source.slug} to={getSourcePath(source.slug)}>
										<span className='badge bg-primary m-1'>{source.name}</span>
									</Link>
								))}
							</p>
						</div>
						<div className='mb-5'>
							<h3 className='mb-3'>Authors ({authors?.length})</h3>
							<p>
								{authors?.map(author => (
									<Link key={author.slug} to={getAuthorPath(author.slug)}>
										<span className='badge bg-primary m-1'>{author.name}</span>
									</Link>
								))}
							</p>
						</div>
					</div>
				</div>
			</DecayingView>
		</ContentWrapper>
	);
};

export default Home;
