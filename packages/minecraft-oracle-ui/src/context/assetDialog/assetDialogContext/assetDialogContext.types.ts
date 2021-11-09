import { Asset } from 'hooks/marketplace/types';

export type AssetDialogData = {
  assetERC1155?: Asset;
  assetAddressERC20?: string;
  image?: string;
  title?: string;
} | undefined;

export type AssetDialogContextType = {
  isAssetDialogOpen: boolean;
  setAssetDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  assetDialogData?: AssetDialogData;
  setAssetDialogData: React.Dispatch<React.SetStateAction<AssetDialogData>>;
};
