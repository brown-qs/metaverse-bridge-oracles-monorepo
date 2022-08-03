import { Asset } from 'hooks/marketplace/types';

export type EnraptureDialogData = {
  asset?: Asset;
  amount?: string;
  owner?: string;
  beneficiary?: string;
  enrapturable?: boolean,
  importable?: boolean,
  isResource?: boolean,
} | undefined;

export type EnraptureDialogContextType = {
  isEnraptureDialogOpen: boolean
  onEnraptureDialogOpen: () => void
  onEnraptureDialogClose: () => void
  enraptureDialogData?: EnraptureDialogData;
  setEnraptureDialogData: React.Dispatch<React.SetStateAction<EnraptureDialogData>>;
};
