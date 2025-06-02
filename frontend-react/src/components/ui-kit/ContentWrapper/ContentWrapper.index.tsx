import styles from './ContentWrapper.module.scss';
import { IContentWrapper } from './ContentWrapper.types';

const ContentWrapper: React.FC<IContentWrapper> = ({ children }) => <div className={styles.wrapper}>{children}</div>;

export default ContentWrapper;
