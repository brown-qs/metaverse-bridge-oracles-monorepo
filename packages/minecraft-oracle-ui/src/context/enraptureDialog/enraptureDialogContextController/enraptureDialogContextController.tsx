import { useDisclosure } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

import { EnraptureDialogContext } from '../enraptureDialogContext/enraptureDialogContext';
import { EnraptureDialogData } from '../enraptureDialogContext/enraptureDialogContext.types';

import { EnraptureDialogContextControllerProps } from './enraptureDialogContextController.types';

export const EnraptureDialogContextController = ({
  children,
}: EnraptureDialogContextControllerProps) => {
  const { isOpen: isEnraptureDialogOpen, onOpen: onEnraptureDialogOpen, onClose: onEnraptureDialogClose } = useDisclosure()
  const [enraptureDialogData, setEnraptureDialogData] = useState<EnraptureDialogData>(undefined);

  useEffect(() => {
    if (!isEnraptureDialogOpen) {
      setEnraptureDialogData(undefined);
    }
  }, [isEnraptureDialogOpen]);

  return (
    <EnraptureDialogContext.Provider
      value={{ isEnraptureDialogOpen, onEnraptureDialogOpen, onEnraptureDialogClose, enraptureDialogData, setEnraptureDialogData }}
    >
      {children}
    </EnraptureDialogContext.Provider>
  );
};
