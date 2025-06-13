import { IContent } from './Content.types';
import styles from './Content.module.scss';

const Content: React.FC<IContent> = ({ children }) => <div className={styles.contentWrp}>{children}</div>;

export default Content;
