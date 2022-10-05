import { createContext } from 'react';
import { CaptchaContextType } from './captchaContext.types';

export const CaptchaContext = createContext<
  CaptchaContextType | undefined
>(undefined);
