import { VideoHTMLAttributes } from 'react';
import { useClasses } from 'hooks';
import { IMoonsamaMedia } from '../../components/Media/Media';

export const Video = ({ src, onLoad, onError }: IMoonsamaMedia) => {
  return (
    <video
      autoPlay
      muted
      loop
      controls
      onPlay={() => onLoad()}
      onError={() => onError()}
      src={src}
    />
  );
};
