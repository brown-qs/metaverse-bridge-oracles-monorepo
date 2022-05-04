import { Asset } from '../../../hooks/marketplace/types';
import { InGameItemWithStatic } from '../../../hooks/multiverse/useInGameItems';

export type ImportDialogData = {
  asset?: Asset;
  amount?: string;
  owner?: string;
  beneficiary?: string;
  enrapturable?: boolean,
  importable?: boolean,
  item?: InGameItemWithStatic
} | undefined;

export type ImportDialogContextType = {
  isImportDialogOpen: boolean;
  setImportDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  importDialogData?: ImportDialogData;
  setImportDialogData: React.Dispatch<React.SetStateAction<ImportDialogData>>;
};
