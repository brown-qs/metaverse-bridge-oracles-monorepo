import { useDisclosure } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { OnChainTokenWithRecognizedTokenData } from '../../../utils/graphqlReformatter';

import { ImportDialogContext } from '../importDialogContext/ImportDialogContext';

import { ImportDialogContextControllerProps } from './ImportDialogContextController.types';

export const ImportDialogContextController = ({
  children,
}: ImportDialogContextControllerProps) => {
  const { isOpen: isImportDialogOpen, onOpen: onImportDialogOpen, onClose: onImportDialogClose } = useDisclosure()
  const [importDialogData, setImportDialogData] = useState<OnChainTokenWithRecognizedTokenData | undefined>(undefined);

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
