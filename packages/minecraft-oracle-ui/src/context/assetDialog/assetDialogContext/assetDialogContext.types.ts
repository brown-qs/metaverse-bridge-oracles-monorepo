import { Asset } from 'hooks/marketplace/types';

export type AssetDialogData = {
  assetERC1155?: Asset;
  assetAddressERC20?: string;
  image?: string;
  title?: string;
} | undefined;

export type AssetDialogContextType = {
  isAssetDialogOpen: boolean
  onAssetDialogOpen: () => void
  onAssetDialogClose: () => void
  assetDialogData?: AssetDialogData;
  setAssetDialogData: React.Dispatch<React.SetStateAction<AssetDialogData>>;
};
