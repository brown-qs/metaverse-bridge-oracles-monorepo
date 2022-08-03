import { useDisclosure } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

import { ImportDialogContext } from '../importDialogContext/ImportDialogContext';
import { ImportDialogData } from '../importDialogContext/ImportDialogContext.types';

import { ImportDialogContextControllerProps } from './ImportDialogContextController.types';

export const ImportDialogContextController = ({
  children,
}: ImportDialogContextControllerProps) => {
  const { isOpen: isImportDialogOpen, onOpen: onImportDialogOpen, onClose: onImportDialogClose } = useDisclosure()
  const [importDialogData, setImportDialogData] = useState<ImportDialogData>(undefined);

  useEffect(() => {
    if (!isImportDialogOpen) {
      setImportDialogData(undefined);
    }
  }, [isImportDialogOpen]);

  return (
    <ImportDialogContext.Provider
      value={{ isImportDialogOpen, onImportDialogOpen, onImportDialogClose, importDialogData, setImportDialogData }}
    >
      {children}
    </ImportDialogContext.Provider>
  );
};
