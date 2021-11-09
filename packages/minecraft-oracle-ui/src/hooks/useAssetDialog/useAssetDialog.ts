import { AssetDialogContext } from '../../context/assetDialog/assetDialogContext/assetDialogContext';
import { useContext } from 'react';

export const useAssetDialog = () => {
  const context = useContext(AssetDialogContext);

  if (context === undefined) {
    throw new Error(
      'useAssetDialog must be used within an AssetDialogContextController'
    );
  }
  return context;
};
