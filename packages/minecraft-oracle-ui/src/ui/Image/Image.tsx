import React, { ImgHTMLAttributes, useEffect, useState } from 'react';
import { useClasses } from 'hooks';
import { styles } from './Image.styles';
import { Loader } from 'ui';

export const Image = (props: ImgHTMLAttributes<any>) => {
  const [loaded, setLoaded] = useState<boolean>(false);
  const { image, imageNotShow } = useClasses(styles);

  const handleLoad = () => {
    setLoaded(true);
  };

  return (
    <>
      {!loaded && <Loader />}
      <img
        onLoad={handleLoad}
        onError={handleLoad}
        alt=""
        {...props}
        className={`${image} ${props.className || ''} ${
          !loaded ? imageNotShow : ''
        }`}
      />
    </>
  );
};
