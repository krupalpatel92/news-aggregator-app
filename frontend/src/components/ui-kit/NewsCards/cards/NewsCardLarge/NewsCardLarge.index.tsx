import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { NewsItem } from 'api/article/types';
import styles from './NewsCardLarge.module.scss';
import { getAuthorPath, getCategoryPath, getSourcePath } from 'route/paths';
import { getImageUrl, formatTimeAgo } from 'utils/helper/newsCard';

const NewsCardLarge: React.FC<NewsItem> = ({ name, URL, imgUrl, publishedAt, summary, author, category, source }) => (
	<div className={classNames('card', styles.card)}>
		<div className='row no-gutters'>
			<div className='col-12'>
				<img src={getImageUrl(imgUrl)} className={classNames('card-img', styles.image)} alt={name} loading='lazy' />
			</div>
			<div className='col-12'>
				<div className='card-body'>
					<h5 className='card-title'>
						<a href={URL} className='stretched-link' target='__blank'>
							{name}
						</a>
					</h5>
					<p className={classNames('card-text', styles.metaData)}>
						<small className='text-muted'>
							<Link to={getAuthorPath(author.slug)}>By {author.name}</Link> | Category:{' '}
							<Link to={getCategoryPath(category.slug)}>{category.name}</Link>
						</small>
					</p>
					{summary && <p className='card-text'>{summary}</p>}
					<p className='card-text'>
						<small className='text-muted'>
							{formatTimeAgo(publishedAt)} | Source: <Link to={getSourcePath(source.slug)}>{source.name}</Link>
						</small>
					</p>
				</div>
			</div>
		</div>
	</div>
);

export default NewsCardLarge;
