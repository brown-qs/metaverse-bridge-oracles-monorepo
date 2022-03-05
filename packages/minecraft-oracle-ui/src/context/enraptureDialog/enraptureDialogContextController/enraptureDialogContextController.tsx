import { useEffect, useState } from 'react';

import { EnraptureDialogContext } from '../enraptureDialogContext/enraptureDialogContext';
import { EnraptureDialogData } from '../enraptureDialogContext/enraptureDialogContext.types';

import { EnraptureDialogContextControllerProps } from './enraptureDialogContextController.types';

export const EnraptureDialogContextController = ({
  children,
}: EnraptureDialogContextControllerProps) => {
  const [isEnraptureDialogOpen, setEnraptureDialogOpen] = useState<boolean>(false);
  const [enraptureDialogData, setEnraptureDialogData] = useState<EnraptureDialogData>(undefined);

  useEffect(() => {
    if (!isEnraptureDialogOpen) {
      setEnraptureDialogData(undefined);
    }
  }, [isEnraptureDialogOpen]);

  return (
    <EnraptureDialogContext.Provider
      value={{ isEnraptureDialogOpen, setEnraptureDialogOpen, enraptureDialogData, setEnraptureDialogData }}
    >
      {children}
    </EnraptureDialogContext.Provider>
  );
};
