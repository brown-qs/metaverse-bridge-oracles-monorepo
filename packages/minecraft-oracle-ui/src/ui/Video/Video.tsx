import { VideoHTMLAttributes } from 'react';
import { useClasses } from 'hooks';
import { styles } from './Video.styles';

export const Video = (props: VideoHTMLAttributes<any>) => {
  const { video } = useClasses(styles);
  return (
    <video
      autoPlay
      muted
      loop
      controls
      {...props}
      className={`${video} ${props.className || ''}`}
    />
  );
};
