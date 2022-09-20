import { useDisclosure } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { OnChainTokenWithRecognizedTokenData } from '../../../utils/graphqlReformatter';
import { EnraptureDialogContext } from '../enraptureDialogContext/enraptureDialogContext';
import { EnraptureDialogContextControllerProps } from './enraptureDialogContextController.types';

export const EnraptureDialogContextController = ({
  children,
}: EnraptureDialogContextControllerProps) => {
  const { isOpen: isEnraptureDialogOpen, onOpen: onEnraptureDialogOpen, onClose: onEnraptureDialogClose } = useDisclosure()
  const [enraptureDialogData, setEnraptureDialogData] = useState<OnChainTokenWithRecognizedTokenData | undefined>(undefined);

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
