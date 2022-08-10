import { Text, Box, CircularProgress, keyframes, VStack, HStack } from '@chakra-ui/react';
import { useFileType } from 'hooks';
import { VideoHTMLAttributes, ImgHTMLAttributes, useState } from 'react';
import { PhotoOff } from 'tabler-icons-react';
import { MoonsamaImage, Placeholder, Video } from 'ui';

import LogoWhite from '../../assets/images/logo_white.svg';

type MediaProps = {
  uri?: string;
  padding?: string
};
export interface IMoonsamaMedia {
  src: string,
  onLoad: () => void,
  onError: () => void
}
export const Media = ({ uri, padding }: MediaProps) => {
  const { getMediaType, mediaUrl, isLoading } = useFileType(uri);
  const [mediaLoading, setMediaLoading] = useState<boolean>(true)
  const [mediaError, setMediaError] = useState<boolean>(false)

  const mediaType = getMediaType();


  const getMedia = () => {
    if (["xml", "image"].includes(String(mediaType)) && mediaUrl) {
      return <MoonsamaImage
        src={mediaUrl}
        onLoad={() => {
          setMediaLoading(false)

        }
        }
        onError={() => {
          setMediaLoading(false)
          setMediaError(true)
        }
        } />;
    }

    if ((mediaType === 'video' || mediaType === 'audio') && mediaUrl) {
      return <Video
        src={mediaUrl}
        onLoad={() => {
          setMediaLoading(false)
        }
        }
        onError={() => {
          setMediaLoading(false)
          setMediaError(true)
        }
        } />;
    }
  }
  const loading = isLoading || mediaLoading
  const loadingOrError = (loading || mediaError)
  const brokenImage = mediaError || !mediaUrl

  const gradient = "linear-gradient(90deg, rgba(255, 255, 255, .01) 0px, rgba(255, 255, 255, .1) 40px, rgba(255, 255, 255, .01) 80px)"
  const skeletonAnimation = keyframes`
  0% {
    background-image: ${gradient};
    background-size: 600px;
    background-position: -100px;
  }
  100%, 40% {
    background-image: ${gradient};
    background-size: 600px;
    background-position: 140px;
  }
  `
  return (
    <Box
      w="100%"
      h="100%"
      overflow="hidden"
      backgroundColor={loadingOrError ? "whiteAlpha.100" : "transparent"}
      animation={loading ? `${skeletonAnimation} 1.6s linear infinite` : "inherit"}
    >

      {!isLoading && !!mediaUrl && !mediaError &&
        < Box
          overflow="hidden"
          opacity={mediaLoading ? "0" : "1"}
          w="100%"
          h="100%"
          bg="transparent"
          padding={padding}
        >
          {getMedia()}
        </Box>
      }
      {mediaError &&
        <VStack alignItems="center" h="100%" w="100%">
          <Box flex="1"></Box>
          <Box alignSelf="center"><PhotoOff color="#fefefe"></PhotoOff></Box>
          <Box flex="1"></Box>
        </VStack>
      }

    </Box >)
};
