import { createContext } from 'react';
import { KiltLoginDialogContextType } from './KiltLoginDialogContext.types';

export const KiltLoginDialogContext = createContext<
  KiltLoginDialogContextType | undefined
>(undefined);
