import { createContext } from 'react';
import { OauthLoginContextType } from './OauthLoginContext.types';

export const OauthLoginContext = createContext<
  OauthLoginContextType | undefined
>(undefined);
