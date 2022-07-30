import { ChainId } from '../../../constants';
import { Asset, Order } from 'hooks/marketplace/types';
import { OrderType } from '../../../utils/subgraph';

export type TransferData = {
  asset: Partial<Asset>;
} | null;

export type TransferDialogContextType = {
  isTransferDialogOpen: boolean
  onTransferDialogOpen: () => void
  onTransferDialogClose: () => void
  transferData?: TransferData;
  setTransferData: React.Dispatch<React.SetStateAction<TransferData>>;
};
