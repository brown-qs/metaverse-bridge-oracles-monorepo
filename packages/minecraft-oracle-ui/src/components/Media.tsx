import { Text, Box, CircularProgress, keyframes, VStack, HStack, BoxProps, ImageProps } from '@chakra-ui/react';
import { VideoHTMLAttributes, ImgHTMLAttributes, useState } from 'react';
import { PhotoOff } from 'tabler-icons-react';

import LogoWhite from '../../assets/images/logo_white.svg';
import { MoonsamaVideo } from './MoonsamaVideo';
import { useFileType } from '../hooks';
import { MoonsamaImage } from './MoonsamaImage';

export interface MediaProps extends BoxProps {
    uri?: string;
    imageProps?: ImageProps
    videoProps?: React.DetailedHTMLProps<VideoHTMLAttributes<HTMLVideoElement>, HTMLVideoElement>,

};

export const Media = ({ uri, imageProps, videoProps, ...props }: MediaProps) => {
    const { getMediaType, mediaUrl, isLoading } = useFileType(uri);
    const [mediaLoading, setMediaLoading] = useState<boolean>(true)
    const [mediaError, setMediaError] = useState<boolean>(false)

    const mediaType = getMediaType();

    const getMedia = () => {
        if (["xml", "image"].includes(String(mediaType)) && mediaUrl) {
            return <MoonsamaImage
                imageProps={imageProps}
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
            return <MoonsamaVideo
                videoProps={videoProps}
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
            //  borderRadius={borderRadius}
            overflow="hidden"
            backgroundColor={loadingOrError ? "blackAlpha.300" : "transparent"}
            animation={(loading && typeof uri === "string") ? `${skeletonAnimation} 1.6s linear infinite` : "inherit"}
            {...props}
        >

            {!isLoading && !!mediaUrl && !mediaError &&
                <Box
                    overflow="hidden"
                    opacity={mediaLoading ? "0" : "1"}
                    w="100%"
                    h="100%"
                    bg="transparent"
                //  padding={padding}
                >
                    {getMedia()}
                </Box>
            }
            {(mediaError || typeof uri !== "string") &&
                <VStack alignItems="center" h="100%" w="100%">
                    <Box flex="1"></Box>
                    <Box alignSelf="center"><PhotoOff color="#fefefe"></PhotoOff></Box>
                    <Box flex="1"></Box>
                </VStack>
            }

        </Box >)
};