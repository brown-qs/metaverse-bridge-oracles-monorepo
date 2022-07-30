import { Asset } from '../../../hooks/marketplace/types';
import { InGameItemWithStatic } from '../../../hooks/multiverse/useInGameItems';

export type ExportDialogData = {
  asset?: Asset;
  address?: string;
  chain?: number;
  hash?: string,
  item?: InGameItemWithStatic
} | undefined;

export type ExportDialogContextType = {
  isExportDialogOpen: boolean
  onExportDialogOpen: () => void
  onExportDialogClose: () => void
  exportDialogData?: ExportDialogData;
  setExportDialogData: React.Dispatch<React.SetStateAction<ExportDialogData>>;
};
