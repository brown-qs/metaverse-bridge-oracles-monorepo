import { Box, BoxProps, Image } from "@chakra-ui/react";


export interface MediaProps extends BoxProps {
    uri?: string;
};
export const MoonsamaImage = ({ src, onLoad, onError, borderRadius }: any) => {
    return (
        <Image
            borderRadius={borderRadius}
            w="100%"
            h="100%"
            overflow="hidden"
            objectFit="cover"
            onLoad={() => onLoad()}
            onError={() => onError()}
            src={src}
        />
    );
};