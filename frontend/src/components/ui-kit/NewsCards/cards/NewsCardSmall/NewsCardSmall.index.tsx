import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { NewsItem } from 'api/article/types';
import styles from './NewsCardSmall.module.scss';
import { getAuthorPath } from 'route/paths';
import { getImageUrl, formatTimeAgo } from 'utils/helper/newsCard';

const NewsCardSmall: React.FC<NewsItem> = ({ name, URL, publishedAt, imgUrl, author }) => (
	<div className={classNames('card', styles.card)}>
		<div className='row no-gutters'>
			<div className='col-md-4'>
				<img src={getImageUrl(imgUrl)} className={classNames('card-img-top', styles.image)} alt={name} loading='lazy' />
			</div>
			<div className='col-md-8'>
				<div className='card-body px-0'>
					<h5 className='card-title'>
						<a href={URL} className='stretched-link' target='__blank'>
							{name}
						</a>
					</h5>
					<p className={classNames('card-text', styles.metaData)}>
						<small className='text-muted'>
							{formatTimeAgo(publishedAt)} | <Link to={getAuthorPath(author.slug)}>By {author.name}</Link>
						</small>
					</p>
				</div>
			</div>
		</div>
	</div>
);

export default NewsCardSmall;
