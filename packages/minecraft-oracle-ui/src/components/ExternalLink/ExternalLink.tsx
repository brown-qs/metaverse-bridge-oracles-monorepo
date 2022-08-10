import { useClasses } from 'hooks';
import { styles as externalLinkStyles } from './ExternalLink.styles';

export const ExternalLink = ({ href, children }: any) => {
  const styles = useClasses(externalLinkStyles);

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={styles.externalLink}
    >
      {children}
    </a>
  );
};
