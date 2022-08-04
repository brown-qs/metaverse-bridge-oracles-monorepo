
import { Box, Image } from '@chakra-ui/react';
import { useClasses } from 'hooks';
import { Asset as AssetType } from 'pages/moonsama/designer/index'


type layersType = Array<AssetType>;

const ImageStack = ({ layers }: { layers: layersType }) => {


  console.log(layers)
  return (
    <Box sx={{ overflow: 'hidden', position: 'relative', width: '100%', height: '100%' }} >
      {layers.sort((a, b) => a.zIndex === b.zIndex ? 0 : (a.zIndex < b.zIndex ? -1 : 1)).map(layer => (
        <Image crossOrigin="anonymous" src={layer.fullSizeUrl} width="100%" height="100%" position="absolute" objectFit="cover" border="0px" key={layer.fullSizeUrl} alt="Composite Layer" />
      ))}
    </Box>
  );
};

export default ImageStack;
