import React, { ImgHTMLAttributes, useEffect, useState } from 'react';
import { useClasses } from 'hooks';
import { Loader } from 'ui';
import { Box, Image } from "@chakra-ui/react";
import { IMoonsamaMedia } from '../../components/Media/Media';


export const MoonsamaImage = ({ src, onLoad, onError }: IMoonsamaMedia) => {



  return (
    <Image
      w="100%"
      h="100%"
      overflow="hidden"
      objectFit="contain"
      onLoad={() => onLoad()}
      onError={() => onError()}
      src={src}
    />
  );
};
