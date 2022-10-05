import { Box, BoxProps, Image, ImageProps } from "@chakra-ui/react";


export interface IMoonsamaImage {
    imageProps?: ImageProps,
    src: string,
    onLoad: () => void,
    onError: () => void
}

export const MoonsamaImage = ({ imageProps, src, onLoad, onError }: IMoonsamaImage) => {
    return (
        <Image
            w="100%"
            h="100%"
            overflow="hidden"
            objectFit="cover"
            {...imageProps}

            onLoad={() => onLoad()}
            onError={() => onError()}
            src={src}
        />
    );
};