import React, { ImgHTMLAttributes, useEffect, useState } from 'react';
import { useClasses } from 'hooks';
import { Loader } from 'ui';
import { Box, Image } from "@chakra-ui/react";

export interface IMoonsamaImage {
  src: string,
  onLoad: () => void,
  onError: () => void
}
export const MoonsamaImage = ({ src, onLoad, onError }: IMoonsamaImage) => {



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
