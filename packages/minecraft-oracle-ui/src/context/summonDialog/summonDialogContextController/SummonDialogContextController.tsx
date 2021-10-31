import { useEffect, useState } from 'react';

import { SummonDialogContext } from '../summonDialogContext/SummonDialogContext';
import { SummonDialogData } from '../summonDialogContext/SummonDialogContext.types';

import { SummonDialogContextControllerProps } from './SummonDialogContextController.types';

export const SummonDialogContextController = ({
  children,
}: SummonDialogContextControllerProps) => {
  const [isSummonDialogOpen, setSummonDialogOpen] = useState<boolean>(false);
  const [summonDialogData, setSummonDialogData] = useState<SummonDialogData>(undefined);

  useEffect(() => {
    if (!isSummonDialogOpen) {
      setSummonDialogData(undefined);
    }
  }, [isSummonDialogOpen]);

  return (
    <SummonDialogContext.Provider
      value={{ isSummonDialogOpen, setSummonDialogOpen, summonDialogData, setSummonDialogData }}
    >
      {children}
    </SummonDialogContext.Provider>
  );
};
