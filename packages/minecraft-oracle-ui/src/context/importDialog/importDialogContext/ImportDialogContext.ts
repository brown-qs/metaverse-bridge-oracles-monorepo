import { createContext } from 'react';

import { ImportDialogContextType } from './ImportDialogContext.types';

export const ImportDialogContext = createContext<ImportDialogContextType | undefined>(
  undefined
);
