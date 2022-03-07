import { Asset } from 'hooks/marketplace/types';

export type EnraptureDialogData = {
  asset?: Asset;
  amount?: string;
  owner?: string;
  beneficiary?: string;
  enrapturable?: boolean,
  importable?: boolean,
} | undefined;

export type EnraptureDialogContextType = {
  isEnraptureDialogOpen: boolean;
  setEnraptureDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  enraptureDialogData?: EnraptureDialogData;
  setEnraptureDialogData: React.Dispatch<React.SetStateAction<EnraptureDialogData>>;
};
