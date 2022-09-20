import { Asset } from '../../../hooks/marketplace/types';
import { InGameItemWithStatic } from '../../../hooks/multiverse/useInGameItems';
import { OnChainTokenWithRecognizedTokenData } from '../../../utils/graphqlReformatter';


export type ImportDialogContextType = {
  isImportDialogOpen: boolean
  onImportDialogOpen: () => void
  onImportDialogClose: () => void
  importDialogData?: OnChainTokenWithRecognizedTokenData;
  setImportDialogData: React.Dispatch<React.SetStateAction<OnChainTokenWithRecognizedTokenData | undefined>>;
};
