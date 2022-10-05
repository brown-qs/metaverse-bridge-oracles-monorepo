import { BoxProps } from '@chakra-ui/react';
import { VideoHTMLAttributes } from 'react';

export interface IMoonsamaVideo {
    videoProps?: React.DetailedHTMLProps<VideoHTMLAttributes<HTMLVideoElement>, HTMLVideoElement>,
    src: string,
    onLoad: () => void,
    onError: () => void
}
export const MoonsamaVideo = ({ videoProps, src, onLoad, onError }: IMoonsamaVideo) => {
    return (
        <video
            {...videoProps}
            autoPlay
            muted
            loop
            onPlay={() => onLoad()}
            onError={() => onError()}
            src={src}
        />
    );
};