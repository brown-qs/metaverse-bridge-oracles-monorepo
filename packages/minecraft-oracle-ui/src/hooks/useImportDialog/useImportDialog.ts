import { useContext } from 'react';
import { ImportDialogContext } from 'context/importDialog/importDialogContext/ImportDialogContext';

export const useImportDialog = () => {
  const context = useContext(ImportDialogContext);

  if (context === undefined) {
    throw new Error(
      'useImportDialog must be used within an ImportDialogContextController'
    );
  }
  return context;
};
