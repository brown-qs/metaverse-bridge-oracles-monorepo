import { useEffect, useState } from 'react';

import { ImportDialogContext } from '../importDialogContext/ImportDialogContext';
import { ImportDialogData } from '../importDialogContext/ImportDialogContext.types';

import { ImportDialogContextControllerProps } from './ImportDialogContextController.types';

export const ImportDialogContextController = ({
  children,
}: ImportDialogContextControllerProps) => {
  const [isImportDialogOpen, setImportDialogOpen] = useState<boolean>(false);
  const [importDialogData, setImportDialogData] = useState<ImportDialogData>(undefined);

  useEffect(() => {
    if (!isImportDialogOpen) {
      setImportDialogData(undefined);
    }
  }, [isImportDialogOpen]);

  return (
    <ImportDialogContext.Provider
      value={{ isImportDialogOpen, setImportDialogOpen, importDialogData, setImportDialogData }}
    >
      {children}
    </ImportDialogContext.Provider>
  );
};
