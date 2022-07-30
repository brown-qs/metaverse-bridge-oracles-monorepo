import { useDisclosure } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

import { AssetDialogContext } from '../assetDialogContext/assetDialogContext';
import { AssetDialogData } from '../assetDialogContext/assetDialogContext.types';

import { AssetDialogContextControllerProps } from './assetDialogContextController.types';

export const AssetDialogContextController = ({
  children,
}: AssetDialogContextControllerProps) => {
  const { isOpen: isAssetDialogOpen, onOpen: onAssetDialogOpen, onClose: onAssetDialogClose } = useDisclosure()
  const [assetDialogData, setAssetDialogData] = useState<AssetDialogData>(undefined);

  useEffect(() => {
    if (!isAssetDialogOpen) {
      setAssetDialogData(undefined);
    }
  }, [isAssetDialogOpen]);

  return (
    <AssetDialogContext.Provider
      value={{ isAssetDialogOpen, onAssetDialogOpen, onAssetDialogClose, assetDialogData, setAssetDialogData }}
    >
      {children}
    </AssetDialogContext.Provider>
  );
};
