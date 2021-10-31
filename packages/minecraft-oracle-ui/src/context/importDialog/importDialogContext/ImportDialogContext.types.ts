import { Asset } from 'hooks/marketplace/types';

export type ImportDialogData = {
  asset?: Asset;
  amount?: string;
  owner?: string;
  beneficiary?: string;
} | undefined;

export type ImportDialogContextType = {
  isImportDialogOpen: boolean;
  setImportDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  importDialogData?: ImportDialogData;
  setImportDialogData: React.Dispatch<React.SetStateAction<ImportDialogData>>;
};
