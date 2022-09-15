import { VideoHTMLAttributes } from 'react';

export const RaresamaVideo = ({ src, onLoad, onError }: any) => {
    return (
        <video
            autoPlay
            muted
            loop
            onPlay={() => onLoad()}
            onError={() => onError()}
            src={src}
        />
    );
};