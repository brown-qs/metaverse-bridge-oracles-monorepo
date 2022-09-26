import { Asset } from '../../../hooks/marketplace/types';
import { InGameTokenMaybeMetadata } from '../../../utils/graphqlReformatter';

export type ExportDialogData = {
  asset?: Asset;
  address?: string;
  chain?: number;
  hash?: string,
  item?: InGameTokenMaybeMetadata
} | undefined;

export type ExportDialogContextType = {
  isExportDialogOpen: boolean
  onExportDialogOpen: () => void
  onExportDialogClose: () => void
  exportDialogData?: ExportDialogData;
  setExportDialogData: React.Dispatch<React.SetStateAction<ExportDialogData>>;
};
