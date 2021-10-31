import { useContext } from 'react';
import { ExportDialogContext } from 'context/exportDialog/exportDialogContext/ExportDialogContext';

export const useExportDialog = () => {
  const context = useContext(ExportDialogContext);

  if (context === undefined) {
    throw new Error(
      'useExportDialog must be used within an ExportDialogContextController'
    );
  }
  return context;
};
