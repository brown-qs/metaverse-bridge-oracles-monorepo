import { useEffect, useState } from 'react';

import { AssetDialogContext } from '../assetDialogContext/assetDialogContext';
import { AssetDialogData } from '../assetDialogContext/assetDialogContext.types';

import { AssetDialogContextControllerProps } from './assetDialogContextController.types';

export const AssetDialogContextController = ({
  children,
}: AssetDialogContextControllerProps) => {
  const [isAssetDialogOpen, setAssetDialogOpen] = useState<boolean>(false);
  const [assetDialogData, setAssetDialogData] = useState<AssetDialogData>(undefined);

  useEffect(() => {
    if (!isAssetDialogOpen) {
      setAssetDialogData(undefined);
    }
  }, [isAssetDialogOpen]);

  return (
    <AssetDialogContext.Provider
      value={{ isAssetDialogOpen, setAssetDialogOpen, assetDialogData, setAssetDialogData }}
    >
      {children}
    </AssetDialogContext.Provider>
  );
};
