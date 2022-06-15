import { BigNumber } from "ethers";
import { StringAssetType } from "../common/enums/AssetType";

export interface Asset {
  // {asset address}-{asset id}
  id: string;
  assetId: string;
  assetType: StringAssetType;
  assetAddress: string;
  chainId?: number
}

export interface StaticTokenData {
  asset: Asset;
  name?: string;
  symbol?: string;
  decimals?: number;
  totalSupply?: BigNumber;
  tokenURI?: string;
  contractURI?: string;
}

export type MetaAttributes = {
    display_type: string;
    trait_type: string;
    value: any;
}

export type TokenMeta = {
  description?: string;
  external_url?: string;
  image?: string;
  name?: string;
  title?: string;
  background_color?: string;
  animation_url?: string;
  youtube_url?: string;
  decimals?: string;
  attributes?: MetaAttributes[];
  properties?: any;
};

export interface ProcessedStaticTokenData {
  asset: Asset;
  name?: string;
  symbol?: string;
  decimals?: number;
  totalSupply?: BigNumber;
  tokenURI?: TokenMeta;
  contractURI?: string;
}