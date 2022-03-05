import { useContext } from 'react';
import { EnraptureDialogContext } from 'context/enraptureDialog/enraptureDialogContext/enraptureDialogContext';

export const useEnraptureDialog = () => {
  const context = useContext(EnraptureDialogContext);

  if (context === undefined) {
    throw new Error(
      'useEnraptureDialog must be used within an EnraptureDialogContextController'
    );
  }
  return context;
};
