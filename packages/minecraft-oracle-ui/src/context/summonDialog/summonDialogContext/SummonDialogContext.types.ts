import { Asset } from 'hooks/marketplace/types';

export type SummonDialogData = {
  recipient?: string;
} | undefined;

export type SummonDialogContextType = {
  isSummonDialogOpen: boolean;
  setSummonDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  summonDialogData?: SummonDialogData;
  setSummonDialogData: React.Dispatch<React.SetStateAction<SummonDialogData>>;
};
