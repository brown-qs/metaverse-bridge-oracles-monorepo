import { createContext } from 'react';
import { EmailLoginDialogContextType } from './EmailLoginDialogContext.types';

export const EmailLoginDialogContext = createContext<
  EmailLoginDialogContextType | undefined
>(undefined);
