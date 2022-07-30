import { useDisclosure } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';

import { TransferDialogContext } from '../transferDialogContext/TransferDialogContext';
import { TransferData } from '../transferDialogContext/TransferDialogContext.types';

import { TransferDialogContextControllerProps } from './TransferDialogContextController.types';

export const TransferDialogContextController = ({
  children,
}: TransferDialogContextControllerProps) => {
  const { isOpen: isTransferDialogOpen, onOpen: onTransferDialogOpen, onClose: onTransferDialogClose } = useDisclosure()

  const [transferData, setTransferData] = useState<TransferData>(null);

  useEffect(() => {
    if (!isTransferDialogOpen) {
      setTransferData(null);
    }
  }, [isTransferDialogOpen]);

  return (
    <TransferDialogContext.Provider
      value={{
        isTransferDialogOpen,
        onTransferDialogOpen,
        onTransferDialogClose,
        transferData,
        setTransferData,
      }}
    >
      {children}
    </TransferDialogContext.Provider>
  );
};
