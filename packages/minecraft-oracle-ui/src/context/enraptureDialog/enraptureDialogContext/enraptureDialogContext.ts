import { createContext } from 'react';

import { EnraptureDialogContextType } from './enraptureDialogContext.types';

export const EnraptureDialogContext = createContext<EnraptureDialogContextType | undefined>(
  undefined
);
