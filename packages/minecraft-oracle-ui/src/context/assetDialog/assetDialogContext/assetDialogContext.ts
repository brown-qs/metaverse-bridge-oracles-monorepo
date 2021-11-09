import { createContext } from 'react';

import { AssetDialogContextType } from './assetDialogContext.types';

export const AssetDialogContext = createContext<AssetDialogContextType | undefined>(
  undefined
);
