import { Asset } from 'hooks/marketplace/types';
import { OnChainTokenWithRecognizedTokenData } from '../../../utils/graphqlReformatter';



export type EnraptureDialogContextType = {
  isEnraptureDialogOpen: boolean
  onEnraptureDialogOpen: () => void
  onEnraptureDialogClose: () => void
  enraptureDialogData?: OnChainTokenWithRecognizedTokenData;
  setEnraptureDialogData: React.Dispatch<React.SetStateAction<OnChainTokenWithRecognizedTokenData | undefined>>;
};
