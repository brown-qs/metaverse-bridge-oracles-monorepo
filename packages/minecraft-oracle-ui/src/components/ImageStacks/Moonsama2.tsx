
import { Box } from '@chakra-ui/react';
import { useClasses } from 'hooks';
import { Asset as AssetType } from 'pages/moonsama/designer/index'

const styles = (theme: any) => ({
  imageStackLayer: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    objectFit: 'scale-down',
    border: '0px'
  }
});

type layersType = Array<AssetType>;

const ImageStack = ({ layers }: { layers: layersType }) => {
  const {
    imageStackLayer,
  } = useClasses(styles);

  return (
    <Box sx={{ overflow: 'hidden', position: 'relative', width: '100%', height: '100%' }}>
      {layers.sort((a, b) => a.zIndex === b.zIndex ? 0 : (a.zIndex < b.zIndex ? -1 : 1)).map(layer => (
        <img crossOrigin="anonymous" src={layer.fullSizeUrl} className={imageStackLayer} key={layer.fullSizeUrl} alt="Composite Layer" />
      ))}
    </Box>
  );
};

export default ImageStack;
