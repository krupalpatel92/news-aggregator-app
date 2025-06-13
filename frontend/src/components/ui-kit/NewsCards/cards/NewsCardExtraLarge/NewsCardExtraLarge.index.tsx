import { Link } from 'react-router-dom';
import { getAuthorPath, getCategoryPath, getSourcePath } from 'route/paths';
import { NewsItem } from 'api/article/types';
import styles from './NewsCardExtraLarge.module.scss';
import classNames from 'classnames';
import { getImageUrl, formatTimeAgo } from 'utils/helper/newsCard';

const NewsCardExtraLarge: React.FC<NewsItem> = ({
	name,
	URL,
	imgUrl,
	publishedAt,
	summary,
	author,
	category,
	source,
}) => (
	<div className={classNames('card', styles.card)}>
		<img src={getImageUrl(imgUrl)} className={classNames('card-img-top', styles.image)} alt={name} loading='lazy' />
		<div className='card-body'>
			<h5 className='card-title'>
				<a href={URL} className='stretched-link' target='__blank'>
					{name}
				</a>
			</h5>
			{summary && <p className='card-text'>{summary}</p>}
			<p className={classNames('card-text', styles.metaData)}>
				<small className='text-muted'>
					{formatTimeAgo(publishedAt)} <Link to={getAuthorPath(author.slug)}>By {author.name}</Link> | Category:{' '}
					<Link to={getCategoryPath(category.slug)}>{category.name}</Link> | Source:{' '}
					<Link to={getSourcePath(source.slug)}>{source.name}</Link>
				</small>
			</p>
		</div>
	</div>
);

export default NewsCardExtraLarge;
