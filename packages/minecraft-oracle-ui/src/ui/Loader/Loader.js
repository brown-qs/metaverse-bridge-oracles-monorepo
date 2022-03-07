import { styles } from './Loader.styles';
import { useClasses } from 'hooks';

export const Loader = () => {
  const { loader, loaderInner } = useClasses(styles);

  return (
    <span className={loader}>
      <span className={loaderInner}></span>
    </span>
  );
};
