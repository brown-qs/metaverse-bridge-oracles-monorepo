import { useDisclosure } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

import { ExportDialogContext } from '../exportDialogContext/ExportDialogContext';
import { ExportDialogData } from '../exportDialogContext/ExportDialogContext.types';

import { ExportDialogContextControllerProps } from './ExportDialogContextController.types';

export const ExportDialogContextController = ({
  children,
}: ExportDialogContextControllerProps) => {
  const { isOpen: isExportDialogOpen, onOpen: onExportDialogOpen, onClose: onExportDialogClose } = useDisclosure()
  const [exportDialogData, setExportDialogData] = useState<ExportDialogData>(undefined);

  useEffect(() => {
    if (!isExportDialogOpen) {
      setExportDialogData(undefined);
    }
  }, [isExportDialogOpen]);

  return (
    <ExportDialogContext.Provider
      value={{ isExportDialogOpen, onExportDialogOpen, onExportDialogClose, exportDialogData, setExportDialogData }}
    >
      {children}
    </ExportDialogContext.Provider>
  );
};
