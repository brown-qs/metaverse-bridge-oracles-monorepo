import { createContext } from 'react';

import { ExportDialogContextType } from './ExportDialogContext.types';

export const ExportDialogContext = createContext<ExportDialogContextType | undefined>(
  undefined
);
