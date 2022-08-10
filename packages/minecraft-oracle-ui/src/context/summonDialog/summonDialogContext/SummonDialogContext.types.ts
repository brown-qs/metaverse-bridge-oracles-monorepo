import { Asset } from 'hooks/marketplace/types';

export type SummonDialogData = {
  recipient?: string;
} | undefined;

export type SummonDialogContextType = {
  isSummonDialogOpen: boolean
  onSummonDialogOpen: () => void
  onSummonDialogClose: () => void
  summonDialogData?: SummonDialogData;
  setSummonDialogData: React.Dispatch<React.SetStateAction<SummonDialogData>>;
};
