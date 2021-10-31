import { useEffect, useState } from 'react';

import { ExportDialogContext } from '../exportDialogContext/ExportDialogContext';
import { ExportDialogData } from '../exportDialogContext/ExportDialogContext.types';

import { ExportDialogContextControllerProps } from './ExportDialogContextController.types';

export const ExportDialogContextController = ({
  children,
}: ExportDialogContextControllerProps) => {
  const [isExportDialogOpen, setExportDialogOpen] = useState<boolean>(false);
  const [exportDialogData, setExportDialogData] = useState<ExportDialogData>(undefined);

  useEffect(() => {
    if (!isExportDialogOpen) {
      setExportDialogData(undefined);
    }
  }, [isExportDialogOpen]);

  return (
    <ExportDialogContext.Provider
      value={{ isExportDialogOpen, setExportDialogOpen, exportDialogData, setExportDialogData }}
    >
      {children}
    </ExportDialogContext.Provider>
  );
};
