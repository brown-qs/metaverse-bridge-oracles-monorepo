import { useDisclosure } from '@chakra-ui/react';
import React, { useState } from 'react';
import { KiltLoginDialogContext } from '../kiltLoginDialogContext/KiltLoginDialogContext';
import { KiltLoginDialogContextControllerProps } from './KiltLoginDialogContextController.types';

export const KiltLoginDialogContextController = ({
  children,
}: KiltLoginDialogContextControllerProps) => {
  const { isOpen: isKiltLoginDialogOpen, onOpen: onKiltLoginDialogOpen, onClose: onKiltLoginDialogClose } = useDisclosure()

  return (
    <KiltLoginDialogContext.Provider
      value={{ isKiltLoginDialogOpen, onKiltLoginDialogOpen, onKiltLoginDialogClose }}
    >
      {children}
    </KiltLoginDialogContext.Provider>
  );
};
