export type CancelData = {
  orderHash: string;
} | null;

export type CancelDialogContextType = {
  isCancelDialogOpen: boolean
  onCancelDialogOpen: () => void
  onCancelDialogClose: () => void
  cancelData?: CancelData;
  setCancelData: React.Dispatch<React.SetStateAction<CancelData>>;
};
