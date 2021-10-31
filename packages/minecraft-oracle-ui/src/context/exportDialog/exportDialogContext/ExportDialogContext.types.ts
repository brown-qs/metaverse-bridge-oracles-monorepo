import { Asset } from 'hooks/marketplace/types';

export type ExportDialogData = {
  asset?: Asset;
  hash?: string
} | undefined;

export type ExportDialogContextType = {
  isExportDialogOpen: boolean;
  setExportDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  exportDialogData?: ExportDialogData;
  setExportDialogData: React.Dispatch<React.SetStateAction<ExportDialogData>>;
};
