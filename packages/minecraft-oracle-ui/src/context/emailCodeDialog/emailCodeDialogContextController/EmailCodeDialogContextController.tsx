import { useDisclosure } from '@chakra-ui/react';
import React, { useState } from 'react';
import { EmailCodeDialogContext } from '../emailCodeDialogContext/EmailCodeDialogContext';
import { EmailCodeDialogContextControllerProps } from './EmailCodeDialogContextController.types';

export const EmailCodeDialogContextController = ({
  children,
}: EmailCodeDialogContextControllerProps) => {
  const { isOpen: isEmailCodeDialogOpen, onOpen: onEmailCodeDialogOpen, onClose: onEmailCodeDialogClose } = useDisclosure()

  return (
    <EmailCodeDialogContext.Provider
      value={{ isEmailCodeDialogOpen, onEmailCodeDialogOpen, onEmailCodeDialogClose }}
    >
      {children}
    </EmailCodeDialogContext.Provider>
  );
};
