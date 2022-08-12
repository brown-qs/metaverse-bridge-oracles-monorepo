import { createContext } from 'react';
import { EmailCodeDialogContextType } from './EmailCodeDialogContext.types';

export const EmailCodeDialogContext = createContext<
  EmailCodeDialogContextType | undefined
>(undefined);
