import WhiteLogo from 'assets/images/logo_white.svg';
import Logo from 'assets/images/logo.svg';
import { useClasses } from 'hooks';
import { styles } from './MediaPlaceholder.styles';

export const Placeholder = ({ style }: { style?: Record<string, string> }) => {
  const { img, placeholder } = useClasses(styles);
  return (
    <div className={placeholder} style={style}>
      <img src={WhiteLogo} className={img} alt="" />
    </div>
  );
};
