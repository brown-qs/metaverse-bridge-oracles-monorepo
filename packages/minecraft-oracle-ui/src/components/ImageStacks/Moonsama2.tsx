import { Box } from '@mui/material';
import { Theme } from '@mui/material';
import { useClasses } from 'hooks';
import { asset as assetType } from 'pages/moonsama/designer/index'

const styles = (theme: Theme) => ({
  imageStackLayer: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    objectFit: 'scale-down',
    border: '0px'
  }
});

type layersType = Array<assetType>;

const ImageStack = ({ layers }: {layers: layersType}) => {
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
