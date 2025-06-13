import styles from './NewsCards.module.scss';
import { INewsCard, NewsCardType } from './NewsCards.types';
import NewsCardExtraLarge from './cards/NewsCardExtraLarge/NewsCardExtraLarge.index';
import NewsCardLarge from './cards/NewsCardLarge/NewsCardLarge.index';
import NewsCardMedium from './cards/NewsCardMedium/NewsCardMedium.index';
import NewsCardSmall from './cards/NewsCardSmall/NewsCardSmall.index';

const NewsCard: React.FC<INewsCard> = ({ type, data }) => (
	<div className={styles.wrapper}>
		{type === NewsCardType.EXTRA_LARGE && <NewsCardExtraLarge {...data} />}
		{type === NewsCardType.LARGE && <NewsCardLarge {...data} />}
		{type === NewsCardType.MEDIUM && <NewsCardMedium {...data} />}
		{type === NewsCardType.SMALL && <NewsCardSmall {...data} />}
	</div>
);

export default NewsCard;
