import { useDisclosure } from '@chakra-ui/react';
import React, { useState } from 'react';
import { AccountDialogContext } from '../accountDialogContext/AccountDialogContext';
import { AccountDialogContextControllerProps } from './AccountDialogContextController.types';

export const AccountDialogContextController = ({
  children,
}: AccountDialogContextControllerProps) => {
  const { isOpen: isAccountDialogOpen, onOpen: onAccountDialogOpen, onClose: onAccountDialogClose } = useDisclosure()

  return (
    <AccountDialogContext.Provider
      value={{ isAccountDialogOpen, onAccountDialogOpen, onAccountDialogClose }}
    >
      {children}
    </AccountDialogContext.Provider>
  );
};
