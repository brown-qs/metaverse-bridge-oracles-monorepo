import { createContext } from 'react';

import { SummonDialogContextType } from './SummonDialogContext.types';

export const SummonDialogContext = createContext<SummonDialogContextType | undefined>(
  undefined
);
