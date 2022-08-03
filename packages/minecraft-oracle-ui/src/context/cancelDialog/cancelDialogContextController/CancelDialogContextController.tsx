import { useDisclosure } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';

import { CancelDialogContext } from '../cancelDialogContext/CancelDialogContext';
import { CancelData } from '../cancelDialogContext/CancelDialogContext.types';

import { CancelDialogContextControllerProps } from './CancelDialogContextController.types';

export const CancelDialogContextController = ({
  children,
}: CancelDialogContextControllerProps) => {
  const { isOpen: isCancelDialogOpen, onOpen: onCancelDialogOpen, onClose: onCancelDialogClose } = useDisclosure()
  const [cancelData, setCancelData] = useState<CancelData>(null);

  useEffect(() => {
    if (!isCancelDialogOpen) {
      setCancelData(null);
    }
  }, [isCancelDialogOpen]);

  return (
    <CancelDialogContext.Provider
      value={{
        isCancelDialogOpen,
        onCancelDialogOpen,
        onCancelDialogClose,
        cancelData,
        setCancelData,
      }}
    >
      {children}
    </CancelDialogContext.Provider>
  );
};
