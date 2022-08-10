import { useDisclosure } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

import { SummonDialogContext } from '../summonDialogContext/SummonDialogContext';
import { SummonDialogData } from '../summonDialogContext/SummonDialogContext.types';

import { SummonDialogContextControllerProps } from './SummonDialogContextController.types';

export const SummonDialogContextController = ({
  children,
}: SummonDialogContextControllerProps) => {
  const { isOpen: isSummonDialogOpen, onOpen: onSummonDialogOpen, onClose: onSummonDialogClose } = useDisclosure()
  const [summonDialogData, setSummonDialogData] = useState<SummonDialogData>(undefined);

  useEffect(() => {
    if (!isSummonDialogOpen) {
      setSummonDialogData(undefined);
    }
  }, [isSummonDialogOpen]);

  return (
    <SummonDialogContext.Provider
      value={{ isSummonDialogOpen, onSummonDialogOpen, onSummonDialogClose, summonDialogData, setSummonDialogData }}
    >
      {children}
    </SummonDialogContext.Provider>
  );
};
