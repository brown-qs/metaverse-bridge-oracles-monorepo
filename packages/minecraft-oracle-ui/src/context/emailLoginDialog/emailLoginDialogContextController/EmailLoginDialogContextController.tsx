import { useDisclosure } from '@chakra-ui/react';
import React, { useState } from 'react';
import { EmailLoginDialogContext } from '../emailLoginDialogContext/EmailLoginDialogContext';
import { EmailLoginDialogContextControllerProps } from './EmailLoginDialogContextController.types';

export const EmailLoginDialogContextController = ({
  children,
}: EmailLoginDialogContextControllerProps) => {
  const { isOpen: isEmailLoginDialogOpen, onOpen: onEmailLoginDialogOpen, onClose: onEmailLoginDialogClose } = useDisclosure()

  return (
    <EmailLoginDialogContext.Provider
      value={{ isEmailLoginDialogOpen, onEmailLoginDialogOpen, onEmailLoginDialogClose }}
    >
      {children}
    </EmailLoginDialogContext.Provider>
  );
};
