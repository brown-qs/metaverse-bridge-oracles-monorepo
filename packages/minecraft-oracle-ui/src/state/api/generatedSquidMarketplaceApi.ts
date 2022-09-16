import { api } from './baseGeneratedSquidMarketplaceApi';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  BigInt: any;
};

export type Attribute = {
  __typename?: 'Attribute';
  displayType?: Maybe<Scalars['String']>;
  traitType: Scalars['String'];
  value: Scalars['String'];
};

export type Erc721Contract = {
  __typename?: 'ERC721Contract';
  address?: Maybe<Scalars['String']>;
  artist?: Maybe<Scalars['String']>;
  artistUrl?: Maybe<Scalars['String']>;
  contractURI?: Maybe<Scalars['String']>;
  contractURIUpdated?: Maybe<Scalars['BigInt']>;
  decimals?: Maybe<Scalars['Int']>;
  description?: Maybe<Scalars['String']>;
  externalLink?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  image?: Maybe<Scalars['String']>;
  metadataName?: Maybe<Scalars['String']>;
  mintedTokens: Array<Erc721Token>;
  name?: Maybe<Scalars['String']>;
  startBlock: Scalars['Int'];
  symbol?: Maybe<Scalars['String']>;
  totalSupply?: Maybe<Scalars['BigInt']>;
};


export type Erc721ContractMintedTokensArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<Erc721TokenOrderByInput>>;
  where?: InputMaybe<Erc721TokenWhereInput>;
};

export type Erc721ContractEdge = {
  __typename?: 'ERC721ContractEdge';
  cursor: Scalars['String'];
  node: Erc721Contract;
};

export enum Erc721ContractOrderByInput {
  AddressAsc = 'address_ASC',
  AddressDesc = 'address_DESC',
  ArtistUrlAsc = 'artistUrl_ASC',
  ArtistUrlDesc = 'artistUrl_DESC',
  ArtistAsc = 'artist_ASC',
  ArtistDesc = 'artist_DESC',
  ContractUriUpdatedAsc = 'contractURIUpdated_ASC',
  ContractUriUpdatedDesc = 'contractURIUpdated_DESC',
  ContractUriAsc = 'contractURI_ASC',
  ContractUriDesc = 'contractURI_DESC',
  DecimalsAsc = 'decimals_ASC',
  DecimalsDesc = 'decimals_DESC',
  DescriptionAsc = 'description_ASC',
  DescriptionDesc = 'description_DESC',
  ExternalLinkAsc = 'externalLink_ASC',
  ExternalLinkDesc = 'externalLink_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  ImageAsc = 'image_ASC',
  ImageDesc = 'image_DESC',
  MetadataNameAsc = 'metadataName_ASC',
  MetadataNameDesc = 'metadataName_DESC',
  NameAsc = 'name_ASC',
  NameDesc = 'name_DESC',
  StartBlockAsc = 'startBlock_ASC',
  StartBlockDesc = 'startBlock_DESC',
  SymbolAsc = 'symbol_ASC',
  SymbolDesc = 'symbol_DESC',
  TotalSupplyAsc = 'totalSupply_ASC',
  TotalSupplyDesc = 'totalSupply_DESC'
}

export type Erc721ContractWhereInput = {
  AND?: InputMaybe<Array<Erc721ContractWhereInput>>;
  OR?: InputMaybe<Array<Erc721ContractWhereInput>>;
  address_contains?: InputMaybe<Scalars['String']>;
  address_containsInsensitive?: InputMaybe<Scalars['String']>;
  address_endsWith?: InputMaybe<Scalars['String']>;
  address_eq?: InputMaybe<Scalars['String']>;
  address_gt?: InputMaybe<Scalars['String']>;
  address_gte?: InputMaybe<Scalars['String']>;
  address_in?: InputMaybe<Array<Scalars['String']>>;
  address_isNull?: InputMaybe<Scalars['Boolean']>;
  address_lt?: InputMaybe<Scalars['String']>;
  address_lte?: InputMaybe<Scalars['String']>;
  address_not_contains?: InputMaybe<Scalars['String']>;
  address_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  address_not_endsWith?: InputMaybe<Scalars['String']>;
  address_not_eq?: InputMaybe<Scalars['String']>;
  address_not_in?: InputMaybe<Array<Scalars['String']>>;
  address_not_startsWith?: InputMaybe<Scalars['String']>;
  address_startsWith?: InputMaybe<Scalars['String']>;
  artistUrl_contains?: InputMaybe<Scalars['String']>;
  artistUrl_containsInsensitive?: InputMaybe<Scalars['String']>;
  artistUrl_endsWith?: InputMaybe<Scalars['String']>;
  artistUrl_eq?: InputMaybe<Scalars['String']>;
  artistUrl_gt?: InputMaybe<Scalars['String']>;
  artistUrl_gte?: InputMaybe<Scalars['String']>;
  artistUrl_in?: InputMaybe<Array<Scalars['String']>>;
  artistUrl_isNull?: InputMaybe<Scalars['Boolean']>;
  artistUrl_lt?: InputMaybe<Scalars['String']>;
  artistUrl_lte?: InputMaybe<Scalars['String']>;
  artistUrl_not_contains?: InputMaybe<Scalars['String']>;
  artistUrl_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  artistUrl_not_endsWith?: InputMaybe<Scalars['String']>;
  artistUrl_not_eq?: InputMaybe<Scalars['String']>;
  artistUrl_not_in?: InputMaybe<Array<Scalars['String']>>;
  artistUrl_not_startsWith?: InputMaybe<Scalars['String']>;
  artistUrl_startsWith?: InputMaybe<Scalars['String']>;
  artist_contains?: InputMaybe<Scalars['String']>;
  artist_containsInsensitive?: InputMaybe<Scalars['String']>;
  artist_endsWith?: InputMaybe<Scalars['String']>;
  artist_eq?: InputMaybe<Scalars['String']>;
  artist_gt?: InputMaybe<Scalars['String']>;
  artist_gte?: InputMaybe<Scalars['String']>;
  artist_in?: InputMaybe<Array<Scalars['String']>>;
  artist_isNull?: InputMaybe<Scalars['Boolean']>;
  artist_lt?: InputMaybe<Scalars['String']>;
  artist_lte?: InputMaybe<Scalars['String']>;
  artist_not_contains?: InputMaybe<Scalars['String']>;
  artist_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  artist_not_endsWith?: InputMaybe<Scalars['String']>;
  artist_not_eq?: InputMaybe<Scalars['String']>;
  artist_not_in?: InputMaybe<Array<Scalars['String']>>;
  artist_not_startsWith?: InputMaybe<Scalars['String']>;
  artist_startsWith?: InputMaybe<Scalars['String']>;
  contractURIUpdated_eq?: InputMaybe<Scalars['BigInt']>;
  contractURIUpdated_gt?: InputMaybe<Scalars['BigInt']>;
  contractURIUpdated_gte?: InputMaybe<Scalars['BigInt']>;
  contractURIUpdated_in?: InputMaybe<Array<Scalars['BigInt']>>;
  contractURIUpdated_isNull?: InputMaybe<Scalars['Boolean']>;
  contractURIUpdated_lt?: InputMaybe<Scalars['BigInt']>;
  contractURIUpdated_lte?: InputMaybe<Scalars['BigInt']>;
  contractURIUpdated_not_eq?: InputMaybe<Scalars['BigInt']>;
  contractURIUpdated_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  contractURI_contains?: InputMaybe<Scalars['String']>;
  contractURI_containsInsensitive?: InputMaybe<Scalars['String']>;
  contractURI_endsWith?: InputMaybe<Scalars['String']>;
  contractURI_eq?: InputMaybe<Scalars['String']>;
  contractURI_gt?: InputMaybe<Scalars['String']>;
  contractURI_gte?: InputMaybe<Scalars['String']>;
  contractURI_in?: InputMaybe<Array<Scalars['String']>>;
  contractURI_isNull?: InputMaybe<Scalars['Boolean']>;
  contractURI_lt?: InputMaybe<Scalars['String']>;
  contractURI_lte?: InputMaybe<Scalars['String']>;
  contractURI_not_contains?: InputMaybe<Scalars['String']>;
  contractURI_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  contractURI_not_endsWith?: InputMaybe<Scalars['String']>;
  contractURI_not_eq?: InputMaybe<Scalars['String']>;
  contractURI_not_in?: InputMaybe<Array<Scalars['String']>>;
  contractURI_not_startsWith?: InputMaybe<Scalars['String']>;
  contractURI_startsWith?: InputMaybe<Scalars['String']>;
  decimals_eq?: InputMaybe<Scalars['Int']>;
  decimals_gt?: InputMaybe<Scalars['Int']>;
  decimals_gte?: InputMaybe<Scalars['Int']>;
  decimals_in?: InputMaybe<Array<Scalars['Int']>>;
  decimals_isNull?: InputMaybe<Scalars['Boolean']>;
  decimals_lt?: InputMaybe<Scalars['Int']>;
  decimals_lte?: InputMaybe<Scalars['Int']>;
  decimals_not_eq?: InputMaybe<Scalars['Int']>;
  decimals_not_in?: InputMaybe<Array<Scalars['Int']>>;
  description_contains?: InputMaybe<Scalars['String']>;
  description_containsInsensitive?: InputMaybe<Scalars['String']>;
  description_endsWith?: InputMaybe<Scalars['String']>;
  description_eq?: InputMaybe<Scalars['String']>;
  description_gt?: InputMaybe<Scalars['String']>;
  description_gte?: InputMaybe<Scalars['String']>;
  description_in?: InputMaybe<Array<Scalars['String']>>;
  description_isNull?: InputMaybe<Scalars['Boolean']>;
  description_lt?: InputMaybe<Scalars['String']>;
  description_lte?: InputMaybe<Scalars['String']>;
  description_not_contains?: InputMaybe<Scalars['String']>;
  description_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  description_not_endsWith?: InputMaybe<Scalars['String']>;
  description_not_eq?: InputMaybe<Scalars['String']>;
  description_not_in?: InputMaybe<Array<Scalars['String']>>;
  description_not_startsWith?: InputMaybe<Scalars['String']>;
  description_startsWith?: InputMaybe<Scalars['String']>;
  externalLink_contains?: InputMaybe<Scalars['String']>;
  externalLink_containsInsensitive?: InputMaybe<Scalars['String']>;
  externalLink_endsWith?: InputMaybe<Scalars['String']>;
  externalLink_eq?: InputMaybe<Scalars['String']>;
  externalLink_gt?: InputMaybe<Scalars['String']>;
  externalLink_gte?: InputMaybe<Scalars['String']>;
  externalLink_in?: InputMaybe<Array<Scalars['String']>>;
  externalLink_isNull?: InputMaybe<Scalars['Boolean']>;
  externalLink_lt?: InputMaybe<Scalars['String']>;
  externalLink_lte?: InputMaybe<Scalars['String']>;
  externalLink_not_contains?: InputMaybe<Scalars['String']>;
  externalLink_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  externalLink_not_endsWith?: InputMaybe<Scalars['String']>;
  externalLink_not_eq?: InputMaybe<Scalars['String']>;
  externalLink_not_in?: InputMaybe<Array<Scalars['String']>>;
  externalLink_not_startsWith?: InputMaybe<Scalars['String']>;
  externalLink_startsWith?: InputMaybe<Scalars['String']>;
  id_contains?: InputMaybe<Scalars['String']>;
  id_containsInsensitive?: InputMaybe<Scalars['String']>;
  id_endsWith?: InputMaybe<Scalars['String']>;
  id_eq?: InputMaybe<Scalars['String']>;
  id_gt?: InputMaybe<Scalars['String']>;
  id_gte?: InputMaybe<Scalars['String']>;
  id_in?: InputMaybe<Array<Scalars['String']>>;
  id_isNull?: InputMaybe<Scalars['Boolean']>;
  id_lt?: InputMaybe<Scalars['String']>;
  id_lte?: InputMaybe<Scalars['String']>;
  id_not_contains?: InputMaybe<Scalars['String']>;
  id_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  id_not_endsWith?: InputMaybe<Scalars['String']>;
  id_not_eq?: InputMaybe<Scalars['String']>;
  id_not_in?: InputMaybe<Array<Scalars['String']>>;
  id_not_startsWith?: InputMaybe<Scalars['String']>;
  id_startsWith?: InputMaybe<Scalars['String']>;
  image_contains?: InputMaybe<Scalars['String']>;
  image_containsInsensitive?: InputMaybe<Scalars['String']>;
  image_endsWith?: InputMaybe<Scalars['String']>;
  image_eq?: InputMaybe<Scalars['String']>;
  image_gt?: InputMaybe<Scalars['String']>;
  image_gte?: InputMaybe<Scalars['String']>;
  image_in?: InputMaybe<Array<Scalars['String']>>;
  image_isNull?: InputMaybe<Scalars['Boolean']>;
  image_lt?: InputMaybe<Scalars['String']>;
  image_lte?: InputMaybe<Scalars['String']>;
  image_not_contains?: InputMaybe<Scalars['String']>;
  image_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  image_not_endsWith?: InputMaybe<Scalars['String']>;
  image_not_eq?: InputMaybe<Scalars['String']>;
  image_not_in?: InputMaybe<Array<Scalars['String']>>;
  image_not_startsWith?: InputMaybe<Scalars['String']>;
  image_startsWith?: InputMaybe<Scalars['String']>;
  metadataName_contains?: InputMaybe<Scalars['String']>;
  metadataName_containsInsensitive?: InputMaybe<Scalars['String']>;
  metadataName_endsWith?: InputMaybe<Scalars['String']>;
  metadataName_eq?: InputMaybe<Scalars['String']>;
  metadataName_gt?: InputMaybe<Scalars['String']>;
  metadataName_gte?: InputMaybe<Scalars['String']>;
  metadataName_in?: InputMaybe<Array<Scalars['String']>>;
  metadataName_isNull?: InputMaybe<Scalars['Boolean']>;
  metadataName_lt?: InputMaybe<Scalars['String']>;
  metadataName_lte?: InputMaybe<Scalars['String']>;
  metadataName_not_contains?: InputMaybe<Scalars['String']>;
  metadataName_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  metadataName_not_endsWith?: InputMaybe<Scalars['String']>;
  metadataName_not_eq?: InputMaybe<Scalars['String']>;
  metadataName_not_in?: InputMaybe<Array<Scalars['String']>>;
  metadataName_not_startsWith?: InputMaybe<Scalars['String']>;
  metadataName_startsWith?: InputMaybe<Scalars['String']>;
  mintedTokens_every?: InputMaybe<Erc721TokenWhereInput>;
  mintedTokens_none?: InputMaybe<Erc721TokenWhereInput>;
  mintedTokens_some?: InputMaybe<Erc721TokenWhereInput>;
  name_contains?: InputMaybe<Scalars['String']>;
  name_containsInsensitive?: InputMaybe<Scalars['String']>;
  name_endsWith?: InputMaybe<Scalars['String']>;
  name_eq?: InputMaybe<Scalars['String']>;
  name_gt?: InputMaybe<Scalars['String']>;
  name_gte?: InputMaybe<Scalars['String']>;
  name_in?: InputMaybe<Array<Scalars['String']>>;
  name_isNull?: InputMaybe<Scalars['Boolean']>;
  name_lt?: InputMaybe<Scalars['String']>;
  name_lte?: InputMaybe<Scalars['String']>;
  name_not_contains?: InputMaybe<Scalars['String']>;
  name_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  name_not_endsWith?: InputMaybe<Scalars['String']>;
  name_not_eq?: InputMaybe<Scalars['String']>;
  name_not_in?: InputMaybe<Array<Scalars['String']>>;
  name_not_startsWith?: InputMaybe<Scalars['String']>;
  name_startsWith?: InputMaybe<Scalars['String']>;
  startBlock_eq?: InputMaybe<Scalars['Int']>;
  startBlock_gt?: InputMaybe<Scalars['Int']>;
  startBlock_gte?: InputMaybe<Scalars['Int']>;
  startBlock_in?: InputMaybe<Array<Scalars['Int']>>;
  startBlock_isNull?: InputMaybe<Scalars['Boolean']>;
  startBlock_lt?: InputMaybe<Scalars['Int']>;
  startBlock_lte?: InputMaybe<Scalars['Int']>;
  startBlock_not_eq?: InputMaybe<Scalars['Int']>;
  startBlock_not_in?: InputMaybe<Array<Scalars['Int']>>;
  symbol_contains?: InputMaybe<Scalars['String']>;
  symbol_containsInsensitive?: InputMaybe<Scalars['String']>;
  symbol_endsWith?: InputMaybe<Scalars['String']>;
  symbol_eq?: InputMaybe<Scalars['String']>;
  symbol_gt?: InputMaybe<Scalars['String']>;
  symbol_gte?: InputMaybe<Scalars['String']>;
  symbol_in?: InputMaybe<Array<Scalars['String']>>;
  symbol_isNull?: InputMaybe<Scalars['Boolean']>;
  symbol_lt?: InputMaybe<Scalars['String']>;
  symbol_lte?: InputMaybe<Scalars['String']>;
  symbol_not_contains?: InputMaybe<Scalars['String']>;
  symbol_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  symbol_not_endsWith?: InputMaybe<Scalars['String']>;
  symbol_not_eq?: InputMaybe<Scalars['String']>;
  symbol_not_in?: InputMaybe<Array<Scalars['String']>>;
  symbol_not_startsWith?: InputMaybe<Scalars['String']>;
  symbol_startsWith?: InputMaybe<Scalars['String']>;
  totalSupply_eq?: InputMaybe<Scalars['BigInt']>;
  totalSupply_gt?: InputMaybe<Scalars['BigInt']>;
  totalSupply_gte?: InputMaybe<Scalars['BigInt']>;
  totalSupply_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalSupply_isNull?: InputMaybe<Scalars['Boolean']>;
  totalSupply_lt?: InputMaybe<Scalars['BigInt']>;
  totalSupply_lte?: InputMaybe<Scalars['BigInt']>;
  totalSupply_not_eq?: InputMaybe<Scalars['BigInt']>;
  totalSupply_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
};

export type Erc721ContractsConnection = {
  __typename?: 'ERC721ContractsConnection';
  edges: Array<Erc721ContractEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type Erc721Owner = {
  __typename?: 'ERC721Owner';
  balance: Scalars['BigInt'];
  id: Scalars['String'];
  ownedTokens: Array<Erc721Token>;
};


export type Erc721OwnerOwnedTokensArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<Erc721TokenOrderByInput>>;
  where?: InputMaybe<Erc721TokenWhereInput>;
};

export type Erc721OwnerEdge = {
  __typename?: 'ERC721OwnerEdge';
  cursor: Scalars['String'];
  node: Erc721Owner;
};

export enum Erc721OwnerOrderByInput {
  BalanceAsc = 'balance_ASC',
  BalanceDesc = 'balance_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC'
}

export type Erc721OwnerWhereInput = {
  AND?: InputMaybe<Array<Erc721OwnerWhereInput>>;
  OR?: InputMaybe<Array<Erc721OwnerWhereInput>>;
  balance_eq?: InputMaybe<Scalars['BigInt']>;
  balance_gt?: InputMaybe<Scalars['BigInt']>;
  balance_gte?: InputMaybe<Scalars['BigInt']>;
  balance_in?: InputMaybe<Array<Scalars['BigInt']>>;
  balance_isNull?: InputMaybe<Scalars['Boolean']>;
  balance_lt?: InputMaybe<Scalars['BigInt']>;
  balance_lte?: InputMaybe<Scalars['BigInt']>;
  balance_not_eq?: InputMaybe<Scalars['BigInt']>;
  balance_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  id_contains?: InputMaybe<Scalars['String']>;
  id_containsInsensitive?: InputMaybe<Scalars['String']>;
  id_endsWith?: InputMaybe<Scalars['String']>;
  id_eq?: InputMaybe<Scalars['String']>;
  id_gt?: InputMaybe<Scalars['String']>;
  id_gte?: InputMaybe<Scalars['String']>;
  id_in?: InputMaybe<Array<Scalars['String']>>;
  id_isNull?: InputMaybe<Scalars['Boolean']>;
  id_lt?: InputMaybe<Scalars['String']>;
  id_lte?: InputMaybe<Scalars['String']>;
  id_not_contains?: InputMaybe<Scalars['String']>;
  id_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  id_not_endsWith?: InputMaybe<Scalars['String']>;
  id_not_eq?: InputMaybe<Scalars['String']>;
  id_not_in?: InputMaybe<Array<Scalars['String']>>;
  id_not_startsWith?: InputMaybe<Scalars['String']>;
  id_startsWith?: InputMaybe<Scalars['String']>;
  ownedTokens_every?: InputMaybe<Erc721TokenWhereInput>;
  ownedTokens_none?: InputMaybe<Erc721TokenWhereInput>;
  ownedTokens_some?: InputMaybe<Erc721TokenWhereInput>;
};

export type Erc721OwnersConnection = {
  __typename?: 'ERC721OwnersConnection';
  edges: Array<Erc721OwnerEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type Erc721Token = {
  __typename?: 'ERC721Token';
  contract: Erc721Contract;
  createdAt: Scalars['BigInt'];
  id: Scalars['String'];
  metadata?: Maybe<Metadata>;
  numericId: Scalars['BigInt'];
  owner?: Maybe<Erc721Owner>;
  tokenUri?: Maybe<Scalars['String']>;
  transfers: Array<Erc721Transfer>;
  updatedAt: Scalars['BigInt'];
};


export type Erc721TokenTransfersArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<Erc721TransferOrderByInput>>;
  where?: InputMaybe<Erc721TransferWhereInput>;
};

export type Erc721TokenEdge = {
  __typename?: 'ERC721TokenEdge';
  cursor: Scalars['String'];
  node: Erc721Token;
};

export enum Erc721TokenOrderByInput {
  ContractAddressAsc = 'contract_address_ASC',
  ContractAddressDesc = 'contract_address_DESC',
  ContractArtistUrlAsc = 'contract_artistUrl_ASC',
  ContractArtistUrlDesc = 'contract_artistUrl_DESC',
  ContractArtistAsc = 'contract_artist_ASC',
  ContractArtistDesc = 'contract_artist_DESC',
  ContractContractUriUpdatedAsc = 'contract_contractURIUpdated_ASC',
  ContractContractUriUpdatedDesc = 'contract_contractURIUpdated_DESC',
  ContractContractUriAsc = 'contract_contractURI_ASC',
  ContractContractUriDesc = 'contract_contractURI_DESC',
  ContractDecimalsAsc = 'contract_decimals_ASC',
  ContractDecimalsDesc = 'contract_decimals_DESC',
  ContractDescriptionAsc = 'contract_description_ASC',
  ContractDescriptionDesc = 'contract_description_DESC',
  ContractExternalLinkAsc = 'contract_externalLink_ASC',
  ContractExternalLinkDesc = 'contract_externalLink_DESC',
  ContractIdAsc = 'contract_id_ASC',
  ContractIdDesc = 'contract_id_DESC',
  ContractImageAsc = 'contract_image_ASC',
  ContractImageDesc = 'contract_image_DESC',
  ContractMetadataNameAsc = 'contract_metadataName_ASC',
  ContractMetadataNameDesc = 'contract_metadataName_DESC',
  ContractNameAsc = 'contract_name_ASC',
  ContractNameDesc = 'contract_name_DESC',
  ContractStartBlockAsc = 'contract_startBlock_ASC',
  ContractStartBlockDesc = 'contract_startBlock_DESC',
  ContractSymbolAsc = 'contract_symbol_ASC',
  ContractSymbolDesc = 'contract_symbol_DESC',
  ContractTotalSupplyAsc = 'contract_totalSupply_ASC',
  ContractTotalSupplyDesc = 'contract_totalSupply_DESC',
  CreatedAtAsc = 'createdAt_ASC',
  CreatedAtDesc = 'createdAt_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  MetadataArtistUrlAsc = 'metadata_artistUrl_ASC',
  MetadataArtistUrlDesc = 'metadata_artistUrl_DESC',
  MetadataArtistAsc = 'metadata_artist_ASC',
  MetadataArtistDesc = 'metadata_artist_DESC',
  MetadataCompositeAsc = 'metadata_composite_ASC',
  MetadataCompositeDesc = 'metadata_composite_DESC',
  MetadataDescriptionAsc = 'metadata_description_ASC',
  MetadataDescriptionDesc = 'metadata_description_DESC',
  MetadataExternalUrlAsc = 'metadata_externalUrl_ASC',
  MetadataExternalUrlDesc = 'metadata_externalUrl_DESC',
  MetadataIdAsc = 'metadata_id_ASC',
  MetadataIdDesc = 'metadata_id_DESC',
  MetadataImageAsc = 'metadata_image_ASC',
  MetadataImageDesc = 'metadata_image_DESC',
  MetadataNameAsc = 'metadata_name_ASC',
  MetadataNameDesc = 'metadata_name_DESC',
  MetadataTypeAsc = 'metadata_type_ASC',
  MetadataTypeDesc = 'metadata_type_DESC',
  NumericIdAsc = 'numericId_ASC',
  NumericIdDesc = 'numericId_DESC',
  OwnerBalanceAsc = 'owner_balance_ASC',
  OwnerBalanceDesc = 'owner_balance_DESC',
  OwnerIdAsc = 'owner_id_ASC',
  OwnerIdDesc = 'owner_id_DESC',
  TokenUriAsc = 'tokenUri_ASC',
  TokenUriDesc = 'tokenUri_DESC',
  UpdatedAtAsc = 'updatedAt_ASC',
  UpdatedAtDesc = 'updatedAt_DESC'
}

export type Erc721TokenWhereInput = {
  AND?: InputMaybe<Array<Erc721TokenWhereInput>>;
  OR?: InputMaybe<Array<Erc721TokenWhereInput>>;
  contract?: InputMaybe<Erc721ContractWhereInput>;
  contract_isNull?: InputMaybe<Scalars['Boolean']>;
  createdAt_eq?: InputMaybe<Scalars['BigInt']>;
  createdAt_gt?: InputMaybe<Scalars['BigInt']>;
  createdAt_gte?: InputMaybe<Scalars['BigInt']>;
  createdAt_in?: InputMaybe<Array<Scalars['BigInt']>>;
  createdAt_isNull?: InputMaybe<Scalars['Boolean']>;
  createdAt_lt?: InputMaybe<Scalars['BigInt']>;
  createdAt_lte?: InputMaybe<Scalars['BigInt']>;
  createdAt_not_eq?: InputMaybe<Scalars['BigInt']>;
  createdAt_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  id_contains?: InputMaybe<Scalars['String']>;
  id_containsInsensitive?: InputMaybe<Scalars['String']>;
  id_endsWith?: InputMaybe<Scalars['String']>;
  id_eq?: InputMaybe<Scalars['String']>;
  id_gt?: InputMaybe<Scalars['String']>;
  id_gte?: InputMaybe<Scalars['String']>;
  id_in?: InputMaybe<Array<Scalars['String']>>;
  id_isNull?: InputMaybe<Scalars['Boolean']>;
  id_lt?: InputMaybe<Scalars['String']>;
  id_lte?: InputMaybe<Scalars['String']>;
  id_not_contains?: InputMaybe<Scalars['String']>;
  id_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  id_not_endsWith?: InputMaybe<Scalars['String']>;
  id_not_eq?: InputMaybe<Scalars['String']>;
  id_not_in?: InputMaybe<Array<Scalars['String']>>;
  id_not_startsWith?: InputMaybe<Scalars['String']>;
  id_startsWith?: InputMaybe<Scalars['String']>;
  metadata?: InputMaybe<MetadataWhereInput>;
  metadata_isNull?: InputMaybe<Scalars['Boolean']>;
  numericId_eq?: InputMaybe<Scalars['BigInt']>;
  numericId_gt?: InputMaybe<Scalars['BigInt']>;
  numericId_gte?: InputMaybe<Scalars['BigInt']>;
  numericId_in?: InputMaybe<Array<Scalars['BigInt']>>;
  numericId_isNull?: InputMaybe<Scalars['Boolean']>;
  numericId_lt?: InputMaybe<Scalars['BigInt']>;
  numericId_lte?: InputMaybe<Scalars['BigInt']>;
  numericId_not_eq?: InputMaybe<Scalars['BigInt']>;
  numericId_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  owner?: InputMaybe<Erc721OwnerWhereInput>;
  owner_isNull?: InputMaybe<Scalars['Boolean']>;
  tokenUri_contains?: InputMaybe<Scalars['String']>;
  tokenUri_containsInsensitive?: InputMaybe<Scalars['String']>;
  tokenUri_endsWith?: InputMaybe<Scalars['String']>;
  tokenUri_eq?: InputMaybe<Scalars['String']>;
  tokenUri_gt?: InputMaybe<Scalars['String']>;
  tokenUri_gte?: InputMaybe<Scalars['String']>;
  tokenUri_in?: InputMaybe<Array<Scalars['String']>>;
  tokenUri_isNull?: InputMaybe<Scalars['Boolean']>;
  tokenUri_lt?: InputMaybe<Scalars['String']>;
  tokenUri_lte?: InputMaybe<Scalars['String']>;
  tokenUri_not_contains?: InputMaybe<Scalars['String']>;
  tokenUri_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  tokenUri_not_endsWith?: InputMaybe<Scalars['String']>;
  tokenUri_not_eq?: InputMaybe<Scalars['String']>;
  tokenUri_not_in?: InputMaybe<Array<Scalars['String']>>;
  tokenUri_not_startsWith?: InputMaybe<Scalars['String']>;
  tokenUri_startsWith?: InputMaybe<Scalars['String']>;
  transfers_every?: InputMaybe<Erc721TransferWhereInput>;
  transfers_none?: InputMaybe<Erc721TransferWhereInput>;
  transfers_some?: InputMaybe<Erc721TransferWhereInput>;
  updatedAt_eq?: InputMaybe<Scalars['BigInt']>;
  updatedAt_gt?: InputMaybe<Scalars['BigInt']>;
  updatedAt_gte?: InputMaybe<Scalars['BigInt']>;
  updatedAt_in?: InputMaybe<Array<Scalars['BigInt']>>;
  updatedAt_isNull?: InputMaybe<Scalars['Boolean']>;
  updatedAt_lt?: InputMaybe<Scalars['BigInt']>;
  updatedAt_lte?: InputMaybe<Scalars['BigInt']>;
  updatedAt_not_eq?: InputMaybe<Scalars['BigInt']>;
  updatedAt_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
};

export type Erc721TokensConnection = {
  __typename?: 'ERC721TokensConnection';
  edges: Array<Erc721TokenEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type Erc721Transfer = {
  __typename?: 'ERC721Transfer';
  block: Scalars['BigInt'];
  from?: Maybe<Erc721Owner>;
  id: Scalars['String'];
  timestamp: Scalars['BigInt'];
  to?: Maybe<Erc721Owner>;
  token: Erc721Token;
  transactionHash: Scalars['String'];
};

export type Erc721TransferEdge = {
  __typename?: 'ERC721TransferEdge';
  cursor: Scalars['String'];
  node: Erc721Transfer;
};

export enum Erc721TransferOrderByInput {
  BlockAsc = 'block_ASC',
  BlockDesc = 'block_DESC',
  FromBalanceAsc = 'from_balance_ASC',
  FromBalanceDesc = 'from_balance_DESC',
  FromIdAsc = 'from_id_ASC',
  FromIdDesc = 'from_id_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  TimestampAsc = 'timestamp_ASC',
  TimestampDesc = 'timestamp_DESC',
  ToBalanceAsc = 'to_balance_ASC',
  ToBalanceDesc = 'to_balance_DESC',
  ToIdAsc = 'to_id_ASC',
  ToIdDesc = 'to_id_DESC',
  TokenCreatedAtAsc = 'token_createdAt_ASC',
  TokenCreatedAtDesc = 'token_createdAt_DESC',
  TokenIdAsc = 'token_id_ASC',
  TokenIdDesc = 'token_id_DESC',
  TokenNumericIdAsc = 'token_numericId_ASC',
  TokenNumericIdDesc = 'token_numericId_DESC',
  TokenTokenUriAsc = 'token_tokenUri_ASC',
  TokenTokenUriDesc = 'token_tokenUri_DESC',
  TokenUpdatedAtAsc = 'token_updatedAt_ASC',
  TokenUpdatedAtDesc = 'token_updatedAt_DESC',
  TransactionHashAsc = 'transactionHash_ASC',
  TransactionHashDesc = 'transactionHash_DESC'
}

export type Erc721TransferWhereInput = {
  AND?: InputMaybe<Array<Erc721TransferWhereInput>>;
  OR?: InputMaybe<Array<Erc721TransferWhereInput>>;
  block_eq?: InputMaybe<Scalars['BigInt']>;
  block_gt?: InputMaybe<Scalars['BigInt']>;
  block_gte?: InputMaybe<Scalars['BigInt']>;
  block_in?: InputMaybe<Array<Scalars['BigInt']>>;
  block_isNull?: InputMaybe<Scalars['Boolean']>;
  block_lt?: InputMaybe<Scalars['BigInt']>;
  block_lte?: InputMaybe<Scalars['BigInt']>;
  block_not_eq?: InputMaybe<Scalars['BigInt']>;
  block_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  from?: InputMaybe<Erc721OwnerWhereInput>;
  from_isNull?: InputMaybe<Scalars['Boolean']>;
  id_contains?: InputMaybe<Scalars['String']>;
  id_containsInsensitive?: InputMaybe<Scalars['String']>;
  id_endsWith?: InputMaybe<Scalars['String']>;
  id_eq?: InputMaybe<Scalars['String']>;
  id_gt?: InputMaybe<Scalars['String']>;
  id_gte?: InputMaybe<Scalars['String']>;
  id_in?: InputMaybe<Array<Scalars['String']>>;
  id_isNull?: InputMaybe<Scalars['Boolean']>;
  id_lt?: InputMaybe<Scalars['String']>;
  id_lte?: InputMaybe<Scalars['String']>;
  id_not_contains?: InputMaybe<Scalars['String']>;
  id_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  id_not_endsWith?: InputMaybe<Scalars['String']>;
  id_not_eq?: InputMaybe<Scalars['String']>;
  id_not_in?: InputMaybe<Array<Scalars['String']>>;
  id_not_startsWith?: InputMaybe<Scalars['String']>;
  id_startsWith?: InputMaybe<Scalars['String']>;
  timestamp_eq?: InputMaybe<Scalars['BigInt']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  timestamp_isNull?: InputMaybe<Scalars['Boolean']>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']>;
  timestamp_not_eq?: InputMaybe<Scalars['BigInt']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  to?: InputMaybe<Erc721OwnerWhereInput>;
  to_isNull?: InputMaybe<Scalars['Boolean']>;
  token?: InputMaybe<Erc721TokenWhereInput>;
  token_isNull?: InputMaybe<Scalars['Boolean']>;
  transactionHash_contains?: InputMaybe<Scalars['String']>;
  transactionHash_containsInsensitive?: InputMaybe<Scalars['String']>;
  transactionHash_endsWith?: InputMaybe<Scalars['String']>;
  transactionHash_eq?: InputMaybe<Scalars['String']>;
  transactionHash_gt?: InputMaybe<Scalars['String']>;
  transactionHash_gte?: InputMaybe<Scalars['String']>;
  transactionHash_in?: InputMaybe<Array<Scalars['String']>>;
  transactionHash_isNull?: InputMaybe<Scalars['Boolean']>;
  transactionHash_lt?: InputMaybe<Scalars['String']>;
  transactionHash_lte?: InputMaybe<Scalars['String']>;
  transactionHash_not_contains?: InputMaybe<Scalars['String']>;
  transactionHash_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  transactionHash_not_endsWith?: InputMaybe<Scalars['String']>;
  transactionHash_not_eq?: InputMaybe<Scalars['String']>;
  transactionHash_not_in?: InputMaybe<Array<Scalars['String']>>;
  transactionHash_not_startsWith?: InputMaybe<Scalars['String']>;
  transactionHash_startsWith?: InputMaybe<Scalars['String']>;
};

export type Erc721TransfersConnection = {
  __typename?: 'ERC721TransfersConnection';
  edges: Array<Erc721TransferEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type Erc1155Contract = {
  __typename?: 'ERC1155Contract';
  address?: Maybe<Scalars['String']>;
  artist?: Maybe<Scalars['String']>;
  artistUrl?: Maybe<Scalars['String']>;
  contractURI?: Maybe<Scalars['String']>;
  contractURIUpdated?: Maybe<Scalars['BigInt']>;
  decimals?: Maybe<Scalars['Int']>;
  description?: Maybe<Scalars['String']>;
  externalLink?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  image?: Maybe<Scalars['String']>;
  metadataName?: Maybe<Scalars['String']>;
  mintedTokens: Array<Erc1155Token>;
  name?: Maybe<Scalars['String']>;
  startBlock: Scalars['Int'];
  symbol?: Maybe<Scalars['String']>;
  totalSupply: Scalars['BigInt'];
};


export type Erc1155ContractMintedTokensArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<Erc1155TokenOrderByInput>>;
  where?: InputMaybe<Erc1155TokenWhereInput>;
};

export type Erc1155ContractEdge = {
  __typename?: 'ERC1155ContractEdge';
  cursor: Scalars['String'];
  node: Erc1155Contract;
};

export enum Erc1155ContractOrderByInput {
  AddressAsc = 'address_ASC',
  AddressDesc = 'address_DESC',
  ArtistUrlAsc = 'artistUrl_ASC',
  ArtistUrlDesc = 'artistUrl_DESC',
  ArtistAsc = 'artist_ASC',
  ArtistDesc = 'artist_DESC',
  ContractUriUpdatedAsc = 'contractURIUpdated_ASC',
  ContractUriUpdatedDesc = 'contractURIUpdated_DESC',
  ContractUriAsc = 'contractURI_ASC',
  ContractUriDesc = 'contractURI_DESC',
  DecimalsAsc = 'decimals_ASC',
  DecimalsDesc = 'decimals_DESC',
  DescriptionAsc = 'description_ASC',
  DescriptionDesc = 'description_DESC',
  ExternalLinkAsc = 'externalLink_ASC',
  ExternalLinkDesc = 'externalLink_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  ImageAsc = 'image_ASC',
  ImageDesc = 'image_DESC',
  MetadataNameAsc = 'metadataName_ASC',
  MetadataNameDesc = 'metadataName_DESC',
  NameAsc = 'name_ASC',
  NameDesc = 'name_DESC',
  StartBlockAsc = 'startBlock_ASC',
  StartBlockDesc = 'startBlock_DESC',
  SymbolAsc = 'symbol_ASC',
  SymbolDesc = 'symbol_DESC',
  TotalSupplyAsc = 'totalSupply_ASC',
  TotalSupplyDesc = 'totalSupply_DESC'
}

export type Erc1155ContractWhereInput = {
  AND?: InputMaybe<Array<Erc1155ContractWhereInput>>;
  OR?: InputMaybe<Array<Erc1155ContractWhereInput>>;
  address_contains?: InputMaybe<Scalars['String']>;
  address_containsInsensitive?: InputMaybe<Scalars['String']>;
  address_endsWith?: InputMaybe<Scalars['String']>;
  address_eq?: InputMaybe<Scalars['String']>;
  address_gt?: InputMaybe<Scalars['String']>;
  address_gte?: InputMaybe<Scalars['String']>;
  address_in?: InputMaybe<Array<Scalars['String']>>;
  address_isNull?: InputMaybe<Scalars['Boolean']>;
  address_lt?: InputMaybe<Scalars['String']>;
  address_lte?: InputMaybe<Scalars['String']>;
  address_not_contains?: InputMaybe<Scalars['String']>;
  address_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  address_not_endsWith?: InputMaybe<Scalars['String']>;
  address_not_eq?: InputMaybe<Scalars['String']>;
  address_not_in?: InputMaybe<Array<Scalars['String']>>;
  address_not_startsWith?: InputMaybe<Scalars['String']>;
  address_startsWith?: InputMaybe<Scalars['String']>;
  artistUrl_contains?: InputMaybe<Scalars['String']>;
  artistUrl_containsInsensitive?: InputMaybe<Scalars['String']>;
  artistUrl_endsWith?: InputMaybe<Scalars['String']>;
  artistUrl_eq?: InputMaybe<Scalars['String']>;
  artistUrl_gt?: InputMaybe<Scalars['String']>;
  artistUrl_gte?: InputMaybe<Scalars['String']>;
  artistUrl_in?: InputMaybe<Array<Scalars['String']>>;
  artistUrl_isNull?: InputMaybe<Scalars['Boolean']>;
  artistUrl_lt?: InputMaybe<Scalars['String']>;
  artistUrl_lte?: InputMaybe<Scalars['String']>;
  artistUrl_not_contains?: InputMaybe<Scalars['String']>;
  artistUrl_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  artistUrl_not_endsWith?: InputMaybe<Scalars['String']>;
  artistUrl_not_eq?: InputMaybe<Scalars['String']>;
  artistUrl_not_in?: InputMaybe<Array<Scalars['String']>>;
  artistUrl_not_startsWith?: InputMaybe<Scalars['String']>;
  artistUrl_startsWith?: InputMaybe<Scalars['String']>;
  artist_contains?: InputMaybe<Scalars['String']>;
  artist_containsInsensitive?: InputMaybe<Scalars['String']>;
  artist_endsWith?: InputMaybe<Scalars['String']>;
  artist_eq?: InputMaybe<Scalars['String']>;
  artist_gt?: InputMaybe<Scalars['String']>;
  artist_gte?: InputMaybe<Scalars['String']>;
  artist_in?: InputMaybe<Array<Scalars['String']>>;
  artist_isNull?: InputMaybe<Scalars['Boolean']>;
  artist_lt?: InputMaybe<Scalars['String']>;
  artist_lte?: InputMaybe<Scalars['String']>;
  artist_not_contains?: InputMaybe<Scalars['String']>;
  artist_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  artist_not_endsWith?: InputMaybe<Scalars['String']>;
  artist_not_eq?: InputMaybe<Scalars['String']>;
  artist_not_in?: InputMaybe<Array<Scalars['String']>>;
  artist_not_startsWith?: InputMaybe<Scalars['String']>;
  artist_startsWith?: InputMaybe<Scalars['String']>;
  contractURIUpdated_eq?: InputMaybe<Scalars['BigInt']>;
  contractURIUpdated_gt?: InputMaybe<Scalars['BigInt']>;
  contractURIUpdated_gte?: InputMaybe<Scalars['BigInt']>;
  contractURIUpdated_in?: InputMaybe<Array<Scalars['BigInt']>>;
  contractURIUpdated_isNull?: InputMaybe<Scalars['Boolean']>;
  contractURIUpdated_lt?: InputMaybe<Scalars['BigInt']>;
  contractURIUpdated_lte?: InputMaybe<Scalars['BigInt']>;
  contractURIUpdated_not_eq?: InputMaybe<Scalars['BigInt']>;
  contractURIUpdated_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  contractURI_contains?: InputMaybe<Scalars['String']>;
  contractURI_containsInsensitive?: InputMaybe<Scalars['String']>;
  contractURI_endsWith?: InputMaybe<Scalars['String']>;
  contractURI_eq?: InputMaybe<Scalars['String']>;
  contractURI_gt?: InputMaybe<Scalars['String']>;
  contractURI_gte?: InputMaybe<Scalars['String']>;
  contractURI_in?: InputMaybe<Array<Scalars['String']>>;
  contractURI_isNull?: InputMaybe<Scalars['Boolean']>;
  contractURI_lt?: InputMaybe<Scalars['String']>;
  contractURI_lte?: InputMaybe<Scalars['String']>;
  contractURI_not_contains?: InputMaybe<Scalars['String']>;
  contractURI_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  contractURI_not_endsWith?: InputMaybe<Scalars['String']>;
  contractURI_not_eq?: InputMaybe<Scalars['String']>;
  contractURI_not_in?: InputMaybe<Array<Scalars['String']>>;
  contractURI_not_startsWith?: InputMaybe<Scalars['String']>;
  contractURI_startsWith?: InputMaybe<Scalars['String']>;
  decimals_eq?: InputMaybe<Scalars['Int']>;
  decimals_gt?: InputMaybe<Scalars['Int']>;
  decimals_gte?: InputMaybe<Scalars['Int']>;
  decimals_in?: InputMaybe<Array<Scalars['Int']>>;
  decimals_isNull?: InputMaybe<Scalars['Boolean']>;
  decimals_lt?: InputMaybe<Scalars['Int']>;
  decimals_lte?: InputMaybe<Scalars['Int']>;
  decimals_not_eq?: InputMaybe<Scalars['Int']>;
  decimals_not_in?: InputMaybe<Array<Scalars['Int']>>;
  description_contains?: InputMaybe<Scalars['String']>;
  description_containsInsensitive?: InputMaybe<Scalars['String']>;
  description_endsWith?: InputMaybe<Scalars['String']>;
  description_eq?: InputMaybe<Scalars['String']>;
  description_gt?: InputMaybe<Scalars['String']>;
  description_gte?: InputMaybe<Scalars['String']>;
  description_in?: InputMaybe<Array<Scalars['String']>>;
  description_isNull?: InputMaybe<Scalars['Boolean']>;
  description_lt?: InputMaybe<Scalars['String']>;
  description_lte?: InputMaybe<Scalars['String']>;
  description_not_contains?: InputMaybe<Scalars['String']>;
  description_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  description_not_endsWith?: InputMaybe<Scalars['String']>;
  description_not_eq?: InputMaybe<Scalars['String']>;
  description_not_in?: InputMaybe<Array<Scalars['String']>>;
  description_not_startsWith?: InputMaybe<Scalars['String']>;
  description_startsWith?: InputMaybe<Scalars['String']>;
  externalLink_contains?: InputMaybe<Scalars['String']>;
  externalLink_containsInsensitive?: InputMaybe<Scalars['String']>;
  externalLink_endsWith?: InputMaybe<Scalars['String']>;
  externalLink_eq?: InputMaybe<Scalars['String']>;
  externalLink_gt?: InputMaybe<Scalars['String']>;
  externalLink_gte?: InputMaybe<Scalars['String']>;
  externalLink_in?: InputMaybe<Array<Scalars['String']>>;
  externalLink_isNull?: InputMaybe<Scalars['Boolean']>;
  externalLink_lt?: InputMaybe<Scalars['String']>;
  externalLink_lte?: InputMaybe<Scalars['String']>;
  externalLink_not_contains?: InputMaybe<Scalars['String']>;
  externalLink_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  externalLink_not_endsWith?: InputMaybe<Scalars['String']>;
  externalLink_not_eq?: InputMaybe<Scalars['String']>;
  externalLink_not_in?: InputMaybe<Array<Scalars['String']>>;
  externalLink_not_startsWith?: InputMaybe<Scalars['String']>;
  externalLink_startsWith?: InputMaybe<Scalars['String']>;
  id_contains?: InputMaybe<Scalars['String']>;
  id_containsInsensitive?: InputMaybe<Scalars['String']>;
  id_endsWith?: InputMaybe<Scalars['String']>;
  id_eq?: InputMaybe<Scalars['String']>;
  id_gt?: InputMaybe<Scalars['String']>;
  id_gte?: InputMaybe<Scalars['String']>;
  id_in?: InputMaybe<Array<Scalars['String']>>;
  id_isNull?: InputMaybe<Scalars['Boolean']>;
  id_lt?: InputMaybe<Scalars['String']>;
  id_lte?: InputMaybe<Scalars['String']>;
  id_not_contains?: InputMaybe<Scalars['String']>;
  id_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  id_not_endsWith?: InputMaybe<Scalars['String']>;
  id_not_eq?: InputMaybe<Scalars['String']>;
  id_not_in?: InputMaybe<Array<Scalars['String']>>;
  id_not_startsWith?: InputMaybe<Scalars['String']>;
  id_startsWith?: InputMaybe<Scalars['String']>;
  image_contains?: InputMaybe<Scalars['String']>;
  image_containsInsensitive?: InputMaybe<Scalars['String']>;
  image_endsWith?: InputMaybe<Scalars['String']>;
  image_eq?: InputMaybe<Scalars['String']>;
  image_gt?: InputMaybe<Scalars['String']>;
  image_gte?: InputMaybe<Scalars['String']>;
  image_in?: InputMaybe<Array<Scalars['String']>>;
  image_isNull?: InputMaybe<Scalars['Boolean']>;
  image_lt?: InputMaybe<Scalars['String']>;
  image_lte?: InputMaybe<Scalars['String']>;
  image_not_contains?: InputMaybe<Scalars['String']>;
  image_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  image_not_endsWith?: InputMaybe<Scalars['String']>;
  image_not_eq?: InputMaybe<Scalars['String']>;
  image_not_in?: InputMaybe<Array<Scalars['String']>>;
  image_not_startsWith?: InputMaybe<Scalars['String']>;
  image_startsWith?: InputMaybe<Scalars['String']>;
  metadataName_contains?: InputMaybe<Scalars['String']>;
  metadataName_containsInsensitive?: InputMaybe<Scalars['String']>;
  metadataName_endsWith?: InputMaybe<Scalars['String']>;
  metadataName_eq?: InputMaybe<Scalars['String']>;
  metadataName_gt?: InputMaybe<Scalars['String']>;
  metadataName_gte?: InputMaybe<Scalars['String']>;
  metadataName_in?: InputMaybe<Array<Scalars['String']>>;
  metadataName_isNull?: InputMaybe<Scalars['Boolean']>;
  metadataName_lt?: InputMaybe<Scalars['String']>;
  metadataName_lte?: InputMaybe<Scalars['String']>;
  metadataName_not_contains?: InputMaybe<Scalars['String']>;
  metadataName_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  metadataName_not_endsWith?: InputMaybe<Scalars['String']>;
  metadataName_not_eq?: InputMaybe<Scalars['String']>;
  metadataName_not_in?: InputMaybe<Array<Scalars['String']>>;
  metadataName_not_startsWith?: InputMaybe<Scalars['String']>;
  metadataName_startsWith?: InputMaybe<Scalars['String']>;
  mintedTokens_every?: InputMaybe<Erc1155TokenWhereInput>;
  mintedTokens_none?: InputMaybe<Erc1155TokenWhereInput>;
  mintedTokens_some?: InputMaybe<Erc1155TokenWhereInput>;
  name_contains?: InputMaybe<Scalars['String']>;
  name_containsInsensitive?: InputMaybe<Scalars['String']>;
  name_endsWith?: InputMaybe<Scalars['String']>;
  name_eq?: InputMaybe<Scalars['String']>;
  name_gt?: InputMaybe<Scalars['String']>;
  name_gte?: InputMaybe<Scalars['String']>;
  name_in?: InputMaybe<Array<Scalars['String']>>;
  name_isNull?: InputMaybe<Scalars['Boolean']>;
  name_lt?: InputMaybe<Scalars['String']>;
  name_lte?: InputMaybe<Scalars['String']>;
  name_not_contains?: InputMaybe<Scalars['String']>;
  name_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  name_not_endsWith?: InputMaybe<Scalars['String']>;
  name_not_eq?: InputMaybe<Scalars['String']>;
  name_not_in?: InputMaybe<Array<Scalars['String']>>;
  name_not_startsWith?: InputMaybe<Scalars['String']>;
  name_startsWith?: InputMaybe<Scalars['String']>;
  startBlock_eq?: InputMaybe<Scalars['Int']>;
  startBlock_gt?: InputMaybe<Scalars['Int']>;
  startBlock_gte?: InputMaybe<Scalars['Int']>;
  startBlock_in?: InputMaybe<Array<Scalars['Int']>>;
  startBlock_isNull?: InputMaybe<Scalars['Boolean']>;
  startBlock_lt?: InputMaybe<Scalars['Int']>;
  startBlock_lte?: InputMaybe<Scalars['Int']>;
  startBlock_not_eq?: InputMaybe<Scalars['Int']>;
  startBlock_not_in?: InputMaybe<Array<Scalars['Int']>>;
  symbol_contains?: InputMaybe<Scalars['String']>;
  symbol_containsInsensitive?: InputMaybe<Scalars['String']>;
  symbol_endsWith?: InputMaybe<Scalars['String']>;
  symbol_eq?: InputMaybe<Scalars['String']>;
  symbol_gt?: InputMaybe<Scalars['String']>;
  symbol_gte?: InputMaybe<Scalars['String']>;
  symbol_in?: InputMaybe<Array<Scalars['String']>>;
  symbol_isNull?: InputMaybe<Scalars['Boolean']>;
  symbol_lt?: InputMaybe<Scalars['String']>;
  symbol_lte?: InputMaybe<Scalars['String']>;
  symbol_not_contains?: InputMaybe<Scalars['String']>;
  symbol_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  symbol_not_endsWith?: InputMaybe<Scalars['String']>;
  symbol_not_eq?: InputMaybe<Scalars['String']>;
  symbol_not_in?: InputMaybe<Array<Scalars['String']>>;
  symbol_not_startsWith?: InputMaybe<Scalars['String']>;
  symbol_startsWith?: InputMaybe<Scalars['String']>;
  totalSupply_eq?: InputMaybe<Scalars['BigInt']>;
  totalSupply_gt?: InputMaybe<Scalars['BigInt']>;
  totalSupply_gte?: InputMaybe<Scalars['BigInt']>;
  totalSupply_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalSupply_isNull?: InputMaybe<Scalars['Boolean']>;
  totalSupply_lt?: InputMaybe<Scalars['BigInt']>;
  totalSupply_lte?: InputMaybe<Scalars['BigInt']>;
  totalSupply_not_eq?: InputMaybe<Scalars['BigInt']>;
  totalSupply_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
};

export type Erc1155ContractsConnection = {
  __typename?: 'ERC1155ContractsConnection';
  edges: Array<Erc1155ContractEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type Erc1155Owner = {
  __typename?: 'ERC1155Owner';
  id: Scalars['String'];
  ownedTokens: Array<Erc1155TokenOwner>;
};


export type Erc1155OwnerOwnedTokensArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<Erc1155TokenOwnerOrderByInput>>;
  where?: InputMaybe<Erc1155TokenOwnerWhereInput>;
};

export type Erc1155OwnerEdge = {
  __typename?: 'ERC1155OwnerEdge';
  cursor: Scalars['String'];
  node: Erc1155Owner;
};

export enum Erc1155OwnerOrderByInput {
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC'
}

export type Erc1155OwnerWhereInput = {
  AND?: InputMaybe<Array<Erc1155OwnerWhereInput>>;
  OR?: InputMaybe<Array<Erc1155OwnerWhereInput>>;
  id_contains?: InputMaybe<Scalars['String']>;
  id_containsInsensitive?: InputMaybe<Scalars['String']>;
  id_endsWith?: InputMaybe<Scalars['String']>;
  id_eq?: InputMaybe<Scalars['String']>;
  id_gt?: InputMaybe<Scalars['String']>;
  id_gte?: InputMaybe<Scalars['String']>;
  id_in?: InputMaybe<Array<Scalars['String']>>;
  id_isNull?: InputMaybe<Scalars['Boolean']>;
  id_lt?: InputMaybe<Scalars['String']>;
  id_lte?: InputMaybe<Scalars['String']>;
  id_not_contains?: InputMaybe<Scalars['String']>;
  id_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  id_not_endsWith?: InputMaybe<Scalars['String']>;
  id_not_eq?: InputMaybe<Scalars['String']>;
  id_not_in?: InputMaybe<Array<Scalars['String']>>;
  id_not_startsWith?: InputMaybe<Scalars['String']>;
  id_startsWith?: InputMaybe<Scalars['String']>;
  ownedTokens_every?: InputMaybe<Erc1155TokenOwnerWhereInput>;
  ownedTokens_none?: InputMaybe<Erc1155TokenOwnerWhereInput>;
  ownedTokens_some?: InputMaybe<Erc1155TokenOwnerWhereInput>;
};

export type Erc1155OwnersConnection = {
  __typename?: 'ERC1155OwnersConnection';
  edges: Array<Erc1155OwnerEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type Erc1155Token = {
  __typename?: 'ERC1155Token';
  contract?: Maybe<Erc1155Contract>;
  createdAt: Scalars['BigInt'];
  id: Scalars['String'];
  metadata?: Maybe<Metadata>;
  numericId: Scalars['BigInt'];
  owners: Array<Erc1155TokenOwner>;
  tokenUri?: Maybe<Scalars['String']>;
  totalSupply?: Maybe<Scalars['BigInt']>;
  transfers: Array<Erc1155Transfer>;
  updatedAt: Scalars['BigInt'];
};


export type Erc1155TokenOwnersArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<Erc1155TokenOwnerOrderByInput>>;
  where?: InputMaybe<Erc1155TokenOwnerWhereInput>;
};


export type Erc1155TokenTransfersArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<Erc1155TransferOrderByInput>>;
  where?: InputMaybe<Erc1155TransferWhereInput>;
};

export type Erc1155TokenEdge = {
  __typename?: 'ERC1155TokenEdge';
  cursor: Scalars['String'];
  node: Erc1155Token;
};

export enum Erc1155TokenOrderByInput {
  ContractAddressAsc = 'contract_address_ASC',
  ContractAddressDesc = 'contract_address_DESC',
  ContractArtistUrlAsc = 'contract_artistUrl_ASC',
  ContractArtistUrlDesc = 'contract_artistUrl_DESC',
  ContractArtistAsc = 'contract_artist_ASC',
  ContractArtistDesc = 'contract_artist_DESC',
  ContractContractUriUpdatedAsc = 'contract_contractURIUpdated_ASC',
  ContractContractUriUpdatedDesc = 'contract_contractURIUpdated_DESC',
  ContractContractUriAsc = 'contract_contractURI_ASC',
  ContractContractUriDesc = 'contract_contractURI_DESC',
  ContractDecimalsAsc = 'contract_decimals_ASC',
  ContractDecimalsDesc = 'contract_decimals_DESC',
  ContractDescriptionAsc = 'contract_description_ASC',
  ContractDescriptionDesc = 'contract_description_DESC',
  ContractExternalLinkAsc = 'contract_externalLink_ASC',
  ContractExternalLinkDesc = 'contract_externalLink_DESC',
  ContractIdAsc = 'contract_id_ASC',
  ContractIdDesc = 'contract_id_DESC',
  ContractImageAsc = 'contract_image_ASC',
  ContractImageDesc = 'contract_image_DESC',
  ContractMetadataNameAsc = 'contract_metadataName_ASC',
  ContractMetadataNameDesc = 'contract_metadataName_DESC',
  ContractNameAsc = 'contract_name_ASC',
  ContractNameDesc = 'contract_name_DESC',
  ContractStartBlockAsc = 'contract_startBlock_ASC',
  ContractStartBlockDesc = 'contract_startBlock_DESC',
  ContractSymbolAsc = 'contract_symbol_ASC',
  ContractSymbolDesc = 'contract_symbol_DESC',
  ContractTotalSupplyAsc = 'contract_totalSupply_ASC',
  ContractTotalSupplyDesc = 'contract_totalSupply_DESC',
  CreatedAtAsc = 'createdAt_ASC',
  CreatedAtDesc = 'createdAt_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  MetadataArtistUrlAsc = 'metadata_artistUrl_ASC',
  MetadataArtistUrlDesc = 'metadata_artistUrl_DESC',
  MetadataArtistAsc = 'metadata_artist_ASC',
  MetadataArtistDesc = 'metadata_artist_DESC',
  MetadataCompositeAsc = 'metadata_composite_ASC',
  MetadataCompositeDesc = 'metadata_composite_DESC',
  MetadataDescriptionAsc = 'metadata_description_ASC',
  MetadataDescriptionDesc = 'metadata_description_DESC',
  MetadataExternalUrlAsc = 'metadata_externalUrl_ASC',
  MetadataExternalUrlDesc = 'metadata_externalUrl_DESC',
  MetadataIdAsc = 'metadata_id_ASC',
  MetadataIdDesc = 'metadata_id_DESC',
  MetadataImageAsc = 'metadata_image_ASC',
  MetadataImageDesc = 'metadata_image_DESC',
  MetadataNameAsc = 'metadata_name_ASC',
  MetadataNameDesc = 'metadata_name_DESC',
  MetadataTypeAsc = 'metadata_type_ASC',
  MetadataTypeDesc = 'metadata_type_DESC',
  NumericIdAsc = 'numericId_ASC',
  NumericIdDesc = 'numericId_DESC',
  TokenUriAsc = 'tokenUri_ASC',
  TokenUriDesc = 'tokenUri_DESC',
  TotalSupplyAsc = 'totalSupply_ASC',
  TotalSupplyDesc = 'totalSupply_DESC',
  UpdatedAtAsc = 'updatedAt_ASC',
  UpdatedAtDesc = 'updatedAt_DESC'
}

export type Erc1155TokenOwner = {
  __typename?: 'ERC1155TokenOwner';
  balance: Scalars['BigInt'];
  id: Scalars['String'];
  owner: Erc1155Owner;
  token: Erc1155Token;
};

export type Erc1155TokenOwnerEdge = {
  __typename?: 'ERC1155TokenOwnerEdge';
  cursor: Scalars['String'];
  node: Erc1155TokenOwner;
};

export enum Erc1155TokenOwnerOrderByInput {
  BalanceAsc = 'balance_ASC',
  BalanceDesc = 'balance_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  OwnerIdAsc = 'owner_id_ASC',
  OwnerIdDesc = 'owner_id_DESC',
  TokenCreatedAtAsc = 'token_createdAt_ASC',
  TokenCreatedAtDesc = 'token_createdAt_DESC',
  TokenIdAsc = 'token_id_ASC',
  TokenIdDesc = 'token_id_DESC',
  TokenNumericIdAsc = 'token_numericId_ASC',
  TokenNumericIdDesc = 'token_numericId_DESC',
  TokenTokenUriAsc = 'token_tokenUri_ASC',
  TokenTokenUriDesc = 'token_tokenUri_DESC',
  TokenTotalSupplyAsc = 'token_totalSupply_ASC',
  TokenTotalSupplyDesc = 'token_totalSupply_DESC',
  TokenUpdatedAtAsc = 'token_updatedAt_ASC',
  TokenUpdatedAtDesc = 'token_updatedAt_DESC'
}

export type Erc1155TokenOwnerWhereInput = {
  AND?: InputMaybe<Array<Erc1155TokenOwnerWhereInput>>;
  OR?: InputMaybe<Array<Erc1155TokenOwnerWhereInput>>;
  balance_eq?: InputMaybe<Scalars['BigInt']>;
  balance_gt?: InputMaybe<Scalars['BigInt']>;
  balance_gte?: InputMaybe<Scalars['BigInt']>;
  balance_in?: InputMaybe<Array<Scalars['BigInt']>>;
  balance_isNull?: InputMaybe<Scalars['Boolean']>;
  balance_lt?: InputMaybe<Scalars['BigInt']>;
  balance_lte?: InputMaybe<Scalars['BigInt']>;
  balance_not_eq?: InputMaybe<Scalars['BigInt']>;
  balance_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  id_contains?: InputMaybe<Scalars['String']>;
  id_containsInsensitive?: InputMaybe<Scalars['String']>;
  id_endsWith?: InputMaybe<Scalars['String']>;
  id_eq?: InputMaybe<Scalars['String']>;
  id_gt?: InputMaybe<Scalars['String']>;
  id_gte?: InputMaybe<Scalars['String']>;
  id_in?: InputMaybe<Array<Scalars['String']>>;
  id_isNull?: InputMaybe<Scalars['Boolean']>;
  id_lt?: InputMaybe<Scalars['String']>;
  id_lte?: InputMaybe<Scalars['String']>;
  id_not_contains?: InputMaybe<Scalars['String']>;
  id_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  id_not_endsWith?: InputMaybe<Scalars['String']>;
  id_not_eq?: InputMaybe<Scalars['String']>;
  id_not_in?: InputMaybe<Array<Scalars['String']>>;
  id_not_startsWith?: InputMaybe<Scalars['String']>;
  id_startsWith?: InputMaybe<Scalars['String']>;
  owner?: InputMaybe<Erc1155OwnerWhereInput>;
  owner_isNull?: InputMaybe<Scalars['Boolean']>;
  token?: InputMaybe<Erc1155TokenWhereInput>;
  token_isNull?: InputMaybe<Scalars['Boolean']>;
};

export type Erc1155TokenOwnersConnection = {
  __typename?: 'ERC1155TokenOwnersConnection';
  edges: Array<Erc1155TokenOwnerEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type Erc1155TokenWhereInput = {
  AND?: InputMaybe<Array<Erc1155TokenWhereInput>>;
  OR?: InputMaybe<Array<Erc1155TokenWhereInput>>;
  contract?: InputMaybe<Erc1155ContractWhereInput>;
  contract_isNull?: InputMaybe<Scalars['Boolean']>;
  createdAt_eq?: InputMaybe<Scalars['BigInt']>;
  createdAt_gt?: InputMaybe<Scalars['BigInt']>;
  createdAt_gte?: InputMaybe<Scalars['BigInt']>;
  createdAt_in?: InputMaybe<Array<Scalars['BigInt']>>;
  createdAt_isNull?: InputMaybe<Scalars['Boolean']>;
  createdAt_lt?: InputMaybe<Scalars['BigInt']>;
  createdAt_lte?: InputMaybe<Scalars['BigInt']>;
  createdAt_not_eq?: InputMaybe<Scalars['BigInt']>;
  createdAt_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  id_contains?: InputMaybe<Scalars['String']>;
  id_containsInsensitive?: InputMaybe<Scalars['String']>;
  id_endsWith?: InputMaybe<Scalars['String']>;
  id_eq?: InputMaybe<Scalars['String']>;
  id_gt?: InputMaybe<Scalars['String']>;
  id_gte?: InputMaybe<Scalars['String']>;
  id_in?: InputMaybe<Array<Scalars['String']>>;
  id_isNull?: InputMaybe<Scalars['Boolean']>;
  id_lt?: InputMaybe<Scalars['String']>;
  id_lte?: InputMaybe<Scalars['String']>;
  id_not_contains?: InputMaybe<Scalars['String']>;
  id_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  id_not_endsWith?: InputMaybe<Scalars['String']>;
  id_not_eq?: InputMaybe<Scalars['String']>;
  id_not_in?: InputMaybe<Array<Scalars['String']>>;
  id_not_startsWith?: InputMaybe<Scalars['String']>;
  id_startsWith?: InputMaybe<Scalars['String']>;
  metadata?: InputMaybe<MetadataWhereInput>;
  metadata_isNull?: InputMaybe<Scalars['Boolean']>;
  numericId_eq?: InputMaybe<Scalars['BigInt']>;
  numericId_gt?: InputMaybe<Scalars['BigInt']>;
  numericId_gte?: InputMaybe<Scalars['BigInt']>;
  numericId_in?: InputMaybe<Array<Scalars['BigInt']>>;
  numericId_isNull?: InputMaybe<Scalars['Boolean']>;
  numericId_lt?: InputMaybe<Scalars['BigInt']>;
  numericId_lte?: InputMaybe<Scalars['BigInt']>;
  numericId_not_eq?: InputMaybe<Scalars['BigInt']>;
  numericId_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  owners_every?: InputMaybe<Erc1155TokenOwnerWhereInput>;
  owners_none?: InputMaybe<Erc1155TokenOwnerWhereInput>;
  owners_some?: InputMaybe<Erc1155TokenOwnerWhereInput>;
  tokenUri_contains?: InputMaybe<Scalars['String']>;
  tokenUri_containsInsensitive?: InputMaybe<Scalars['String']>;
  tokenUri_endsWith?: InputMaybe<Scalars['String']>;
  tokenUri_eq?: InputMaybe<Scalars['String']>;
  tokenUri_gt?: InputMaybe<Scalars['String']>;
  tokenUri_gte?: InputMaybe<Scalars['String']>;
  tokenUri_in?: InputMaybe<Array<Scalars['String']>>;
  tokenUri_isNull?: InputMaybe<Scalars['Boolean']>;
  tokenUri_lt?: InputMaybe<Scalars['String']>;
  tokenUri_lte?: InputMaybe<Scalars['String']>;
  tokenUri_not_contains?: InputMaybe<Scalars['String']>;
  tokenUri_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  tokenUri_not_endsWith?: InputMaybe<Scalars['String']>;
  tokenUri_not_eq?: InputMaybe<Scalars['String']>;
  tokenUri_not_in?: InputMaybe<Array<Scalars['String']>>;
  tokenUri_not_startsWith?: InputMaybe<Scalars['String']>;
  tokenUri_startsWith?: InputMaybe<Scalars['String']>;
  totalSupply_eq?: InputMaybe<Scalars['BigInt']>;
  totalSupply_gt?: InputMaybe<Scalars['BigInt']>;
  totalSupply_gte?: InputMaybe<Scalars['BigInt']>;
  totalSupply_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalSupply_isNull?: InputMaybe<Scalars['Boolean']>;
  totalSupply_lt?: InputMaybe<Scalars['BigInt']>;
  totalSupply_lte?: InputMaybe<Scalars['BigInt']>;
  totalSupply_not_eq?: InputMaybe<Scalars['BigInt']>;
  totalSupply_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  transfers_every?: InputMaybe<Erc1155TransferWhereInput>;
  transfers_none?: InputMaybe<Erc1155TransferWhereInput>;
  transfers_some?: InputMaybe<Erc1155TransferWhereInput>;
  updatedAt_eq?: InputMaybe<Scalars['BigInt']>;
  updatedAt_gt?: InputMaybe<Scalars['BigInt']>;
  updatedAt_gte?: InputMaybe<Scalars['BigInt']>;
  updatedAt_in?: InputMaybe<Array<Scalars['BigInt']>>;
  updatedAt_isNull?: InputMaybe<Scalars['Boolean']>;
  updatedAt_lt?: InputMaybe<Scalars['BigInt']>;
  updatedAt_lte?: InputMaybe<Scalars['BigInt']>;
  updatedAt_not_eq?: InputMaybe<Scalars['BigInt']>;
  updatedAt_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
};

export type Erc1155TokensConnection = {
  __typename?: 'ERC1155TokensConnection';
  edges: Array<Erc1155TokenEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type Erc1155Transfer = {
  __typename?: 'ERC1155Transfer';
  block: Scalars['BigInt'];
  from?: Maybe<Erc1155Owner>;
  id: Scalars['String'];
  timestamp: Scalars['BigInt'];
  to?: Maybe<Erc1155Owner>;
  token: Erc1155Token;
  transactionHash: Scalars['String'];
};

export type Erc1155TransferEdge = {
  __typename?: 'ERC1155TransferEdge';
  cursor: Scalars['String'];
  node: Erc1155Transfer;
};

export enum Erc1155TransferOrderByInput {
  BlockAsc = 'block_ASC',
  BlockDesc = 'block_DESC',
  FromIdAsc = 'from_id_ASC',
  FromIdDesc = 'from_id_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  TimestampAsc = 'timestamp_ASC',
  TimestampDesc = 'timestamp_DESC',
  ToIdAsc = 'to_id_ASC',
  ToIdDesc = 'to_id_DESC',
  TokenCreatedAtAsc = 'token_createdAt_ASC',
  TokenCreatedAtDesc = 'token_createdAt_DESC',
  TokenIdAsc = 'token_id_ASC',
  TokenIdDesc = 'token_id_DESC',
  TokenNumericIdAsc = 'token_numericId_ASC',
  TokenNumericIdDesc = 'token_numericId_DESC',
  TokenTokenUriAsc = 'token_tokenUri_ASC',
  TokenTokenUriDesc = 'token_tokenUri_DESC',
  TokenTotalSupplyAsc = 'token_totalSupply_ASC',
  TokenTotalSupplyDesc = 'token_totalSupply_DESC',
  TokenUpdatedAtAsc = 'token_updatedAt_ASC',
  TokenUpdatedAtDesc = 'token_updatedAt_DESC',
  TransactionHashAsc = 'transactionHash_ASC',
  TransactionHashDesc = 'transactionHash_DESC'
}

export type Erc1155TransferWhereInput = {
  AND?: InputMaybe<Array<Erc1155TransferWhereInput>>;
  OR?: InputMaybe<Array<Erc1155TransferWhereInput>>;
  block_eq?: InputMaybe<Scalars['BigInt']>;
  block_gt?: InputMaybe<Scalars['BigInt']>;
  block_gte?: InputMaybe<Scalars['BigInt']>;
  block_in?: InputMaybe<Array<Scalars['BigInt']>>;
  block_isNull?: InputMaybe<Scalars['Boolean']>;
  block_lt?: InputMaybe<Scalars['BigInt']>;
  block_lte?: InputMaybe<Scalars['BigInt']>;
  block_not_eq?: InputMaybe<Scalars['BigInt']>;
  block_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  from?: InputMaybe<Erc1155OwnerWhereInput>;
  from_isNull?: InputMaybe<Scalars['Boolean']>;
  id_contains?: InputMaybe<Scalars['String']>;
  id_containsInsensitive?: InputMaybe<Scalars['String']>;
  id_endsWith?: InputMaybe<Scalars['String']>;
  id_eq?: InputMaybe<Scalars['String']>;
  id_gt?: InputMaybe<Scalars['String']>;
  id_gte?: InputMaybe<Scalars['String']>;
  id_in?: InputMaybe<Array<Scalars['String']>>;
  id_isNull?: InputMaybe<Scalars['Boolean']>;
  id_lt?: InputMaybe<Scalars['String']>;
  id_lte?: InputMaybe<Scalars['String']>;
  id_not_contains?: InputMaybe<Scalars['String']>;
  id_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  id_not_endsWith?: InputMaybe<Scalars['String']>;
  id_not_eq?: InputMaybe<Scalars['String']>;
  id_not_in?: InputMaybe<Array<Scalars['String']>>;
  id_not_startsWith?: InputMaybe<Scalars['String']>;
  id_startsWith?: InputMaybe<Scalars['String']>;
  timestamp_eq?: InputMaybe<Scalars['BigInt']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  timestamp_isNull?: InputMaybe<Scalars['Boolean']>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']>;
  timestamp_not_eq?: InputMaybe<Scalars['BigInt']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  to?: InputMaybe<Erc1155OwnerWhereInput>;
  to_isNull?: InputMaybe<Scalars['Boolean']>;
  token?: InputMaybe<Erc1155TokenWhereInput>;
  token_isNull?: InputMaybe<Scalars['Boolean']>;
  transactionHash_contains?: InputMaybe<Scalars['String']>;
  transactionHash_containsInsensitive?: InputMaybe<Scalars['String']>;
  transactionHash_endsWith?: InputMaybe<Scalars['String']>;
  transactionHash_eq?: InputMaybe<Scalars['String']>;
  transactionHash_gt?: InputMaybe<Scalars['String']>;
  transactionHash_gte?: InputMaybe<Scalars['String']>;
  transactionHash_in?: InputMaybe<Array<Scalars['String']>>;
  transactionHash_isNull?: InputMaybe<Scalars['Boolean']>;
  transactionHash_lt?: InputMaybe<Scalars['String']>;
  transactionHash_lte?: InputMaybe<Scalars['String']>;
  transactionHash_not_contains?: InputMaybe<Scalars['String']>;
  transactionHash_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  transactionHash_not_endsWith?: InputMaybe<Scalars['String']>;
  transactionHash_not_eq?: InputMaybe<Scalars['String']>;
  transactionHash_not_in?: InputMaybe<Array<Scalars['String']>>;
  transactionHash_not_startsWith?: InputMaybe<Scalars['String']>;
  transactionHash_startsWith?: InputMaybe<Scalars['String']>;
};

export type Erc1155TransfersConnection = {
  __typename?: 'ERC1155TransfersConnection';
  edges: Array<Erc1155TransferEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type Metadata = {
  __typename?: 'Metadata';
  artist?: Maybe<Scalars['String']>;
  artistUrl?: Maybe<Scalars['String']>;
  attributes?: Maybe<Array<Attribute>>;
  composite?: Maybe<Scalars['Boolean']>;
  description?: Maybe<Scalars['String']>;
  externalUrl?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  image?: Maybe<Scalars['String']>;
  layers?: Maybe<Array<Scalars['String']>>;
  name?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
};

export type MetadataConnection = {
  __typename?: 'MetadataConnection';
  edges: Array<MetadataEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type MetadataEdge = {
  __typename?: 'MetadataEdge';
  cursor: Scalars['String'];
  node: Metadata;
};

export enum MetadataOrderByInput {
  ArtistUrlAsc = 'artistUrl_ASC',
  ArtistUrlDesc = 'artistUrl_DESC',
  ArtistAsc = 'artist_ASC',
  ArtistDesc = 'artist_DESC',
  CompositeAsc = 'composite_ASC',
  CompositeDesc = 'composite_DESC',
  DescriptionAsc = 'description_ASC',
  DescriptionDesc = 'description_DESC',
  ExternalUrlAsc = 'externalUrl_ASC',
  ExternalUrlDesc = 'externalUrl_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  ImageAsc = 'image_ASC',
  ImageDesc = 'image_DESC',
  NameAsc = 'name_ASC',
  NameDesc = 'name_DESC',
  TypeAsc = 'type_ASC',
  TypeDesc = 'type_DESC'
}

export type MetadataWhereInput = {
  AND?: InputMaybe<Array<MetadataWhereInput>>;
  OR?: InputMaybe<Array<MetadataWhereInput>>;
  artistUrl_contains?: InputMaybe<Scalars['String']>;
  artistUrl_containsInsensitive?: InputMaybe<Scalars['String']>;
  artistUrl_endsWith?: InputMaybe<Scalars['String']>;
  artistUrl_eq?: InputMaybe<Scalars['String']>;
  artistUrl_gt?: InputMaybe<Scalars['String']>;
  artistUrl_gte?: InputMaybe<Scalars['String']>;
  artistUrl_in?: InputMaybe<Array<Scalars['String']>>;
  artistUrl_isNull?: InputMaybe<Scalars['Boolean']>;
  artistUrl_lt?: InputMaybe<Scalars['String']>;
  artistUrl_lte?: InputMaybe<Scalars['String']>;
  artistUrl_not_contains?: InputMaybe<Scalars['String']>;
  artistUrl_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  artistUrl_not_endsWith?: InputMaybe<Scalars['String']>;
  artistUrl_not_eq?: InputMaybe<Scalars['String']>;
  artistUrl_not_in?: InputMaybe<Array<Scalars['String']>>;
  artistUrl_not_startsWith?: InputMaybe<Scalars['String']>;
  artistUrl_startsWith?: InputMaybe<Scalars['String']>;
  artist_contains?: InputMaybe<Scalars['String']>;
  artist_containsInsensitive?: InputMaybe<Scalars['String']>;
  artist_endsWith?: InputMaybe<Scalars['String']>;
  artist_eq?: InputMaybe<Scalars['String']>;
  artist_gt?: InputMaybe<Scalars['String']>;
  artist_gte?: InputMaybe<Scalars['String']>;
  artist_in?: InputMaybe<Array<Scalars['String']>>;
  artist_isNull?: InputMaybe<Scalars['Boolean']>;
  artist_lt?: InputMaybe<Scalars['String']>;
  artist_lte?: InputMaybe<Scalars['String']>;
  artist_not_contains?: InputMaybe<Scalars['String']>;
  artist_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  artist_not_endsWith?: InputMaybe<Scalars['String']>;
  artist_not_eq?: InputMaybe<Scalars['String']>;
  artist_not_in?: InputMaybe<Array<Scalars['String']>>;
  artist_not_startsWith?: InputMaybe<Scalars['String']>;
  artist_startsWith?: InputMaybe<Scalars['String']>;
  attributes_isNull?: InputMaybe<Scalars['Boolean']>;
  composite_eq?: InputMaybe<Scalars['Boolean']>;
  composite_isNull?: InputMaybe<Scalars['Boolean']>;
  composite_not_eq?: InputMaybe<Scalars['Boolean']>;
  description_contains?: InputMaybe<Scalars['String']>;
  description_containsInsensitive?: InputMaybe<Scalars['String']>;
  description_endsWith?: InputMaybe<Scalars['String']>;
  description_eq?: InputMaybe<Scalars['String']>;
  description_gt?: InputMaybe<Scalars['String']>;
  description_gte?: InputMaybe<Scalars['String']>;
  description_in?: InputMaybe<Array<Scalars['String']>>;
  description_isNull?: InputMaybe<Scalars['Boolean']>;
  description_lt?: InputMaybe<Scalars['String']>;
  description_lte?: InputMaybe<Scalars['String']>;
  description_not_contains?: InputMaybe<Scalars['String']>;
  description_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  description_not_endsWith?: InputMaybe<Scalars['String']>;
  description_not_eq?: InputMaybe<Scalars['String']>;
  description_not_in?: InputMaybe<Array<Scalars['String']>>;
  description_not_startsWith?: InputMaybe<Scalars['String']>;
  description_startsWith?: InputMaybe<Scalars['String']>;
  externalUrl_contains?: InputMaybe<Scalars['String']>;
  externalUrl_containsInsensitive?: InputMaybe<Scalars['String']>;
  externalUrl_endsWith?: InputMaybe<Scalars['String']>;
  externalUrl_eq?: InputMaybe<Scalars['String']>;
  externalUrl_gt?: InputMaybe<Scalars['String']>;
  externalUrl_gte?: InputMaybe<Scalars['String']>;
  externalUrl_in?: InputMaybe<Array<Scalars['String']>>;
  externalUrl_isNull?: InputMaybe<Scalars['Boolean']>;
  externalUrl_lt?: InputMaybe<Scalars['String']>;
  externalUrl_lte?: InputMaybe<Scalars['String']>;
  externalUrl_not_contains?: InputMaybe<Scalars['String']>;
  externalUrl_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  externalUrl_not_endsWith?: InputMaybe<Scalars['String']>;
  externalUrl_not_eq?: InputMaybe<Scalars['String']>;
  externalUrl_not_in?: InputMaybe<Array<Scalars['String']>>;
  externalUrl_not_startsWith?: InputMaybe<Scalars['String']>;
  externalUrl_startsWith?: InputMaybe<Scalars['String']>;
  id_contains?: InputMaybe<Scalars['String']>;
  id_containsInsensitive?: InputMaybe<Scalars['String']>;
  id_endsWith?: InputMaybe<Scalars['String']>;
  id_eq?: InputMaybe<Scalars['String']>;
  id_gt?: InputMaybe<Scalars['String']>;
  id_gte?: InputMaybe<Scalars['String']>;
  id_in?: InputMaybe<Array<Scalars['String']>>;
  id_isNull?: InputMaybe<Scalars['Boolean']>;
  id_lt?: InputMaybe<Scalars['String']>;
  id_lte?: InputMaybe<Scalars['String']>;
  id_not_contains?: InputMaybe<Scalars['String']>;
  id_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  id_not_endsWith?: InputMaybe<Scalars['String']>;
  id_not_eq?: InputMaybe<Scalars['String']>;
  id_not_in?: InputMaybe<Array<Scalars['String']>>;
  id_not_startsWith?: InputMaybe<Scalars['String']>;
  id_startsWith?: InputMaybe<Scalars['String']>;
  image_contains?: InputMaybe<Scalars['String']>;
  image_containsInsensitive?: InputMaybe<Scalars['String']>;
  image_endsWith?: InputMaybe<Scalars['String']>;
  image_eq?: InputMaybe<Scalars['String']>;
  image_gt?: InputMaybe<Scalars['String']>;
  image_gte?: InputMaybe<Scalars['String']>;
  image_in?: InputMaybe<Array<Scalars['String']>>;
  image_isNull?: InputMaybe<Scalars['Boolean']>;
  image_lt?: InputMaybe<Scalars['String']>;
  image_lte?: InputMaybe<Scalars['String']>;
  image_not_contains?: InputMaybe<Scalars['String']>;
  image_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  image_not_endsWith?: InputMaybe<Scalars['String']>;
  image_not_eq?: InputMaybe<Scalars['String']>;
  image_not_in?: InputMaybe<Array<Scalars['String']>>;
  image_not_startsWith?: InputMaybe<Scalars['String']>;
  image_startsWith?: InputMaybe<Scalars['String']>;
  layers_containsAll?: InputMaybe<Array<Scalars['String']>>;
  layers_containsAny?: InputMaybe<Array<Scalars['String']>>;
  layers_containsNone?: InputMaybe<Array<Scalars['String']>>;
  layers_isNull?: InputMaybe<Scalars['Boolean']>;
  name_contains?: InputMaybe<Scalars['String']>;
  name_containsInsensitive?: InputMaybe<Scalars['String']>;
  name_endsWith?: InputMaybe<Scalars['String']>;
  name_eq?: InputMaybe<Scalars['String']>;
  name_gt?: InputMaybe<Scalars['String']>;
  name_gte?: InputMaybe<Scalars['String']>;
  name_in?: InputMaybe<Array<Scalars['String']>>;
  name_isNull?: InputMaybe<Scalars['Boolean']>;
  name_lt?: InputMaybe<Scalars['String']>;
  name_lte?: InputMaybe<Scalars['String']>;
  name_not_contains?: InputMaybe<Scalars['String']>;
  name_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  name_not_endsWith?: InputMaybe<Scalars['String']>;
  name_not_eq?: InputMaybe<Scalars['String']>;
  name_not_in?: InputMaybe<Array<Scalars['String']>>;
  name_not_startsWith?: InputMaybe<Scalars['String']>;
  name_startsWith?: InputMaybe<Scalars['String']>;
  type_contains?: InputMaybe<Scalars['String']>;
  type_containsInsensitive?: InputMaybe<Scalars['String']>;
  type_endsWith?: InputMaybe<Scalars['String']>;
  type_eq?: InputMaybe<Scalars['String']>;
  type_gt?: InputMaybe<Scalars['String']>;
  type_gte?: InputMaybe<Scalars['String']>;
  type_in?: InputMaybe<Array<Scalars['String']>>;
  type_isNull?: InputMaybe<Scalars['Boolean']>;
  type_lt?: InputMaybe<Scalars['String']>;
  type_lte?: InputMaybe<Scalars['String']>;
  type_not_contains?: InputMaybe<Scalars['String']>;
  type_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  type_not_endsWith?: InputMaybe<Scalars['String']>;
  type_not_eq?: InputMaybe<Scalars['String']>;
  type_not_in?: InputMaybe<Array<Scalars['String']>>;
  type_not_startsWith?: InputMaybe<Scalars['String']>;
  type_startsWith?: InputMaybe<Scalars['String']>;
};

export type PageInfo = {
  __typename?: 'PageInfo';
  endCursor: Scalars['String'];
  hasNextPage: Scalars['Boolean'];
  hasPreviousPage: Scalars['Boolean'];
  startCursor: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  erc721ContractById?: Maybe<Erc721Contract>;
  /** @deprecated Use erc721ContractById */
  erc721ContractByUniqueInput?: Maybe<Erc721Contract>;
  erc721Contracts: Array<Erc721Contract>;
  erc721ContractsConnection: Erc721ContractsConnection;
  erc721OwnerById?: Maybe<Erc721Owner>;
  /** @deprecated Use erc721OwnerById */
  erc721OwnerByUniqueInput?: Maybe<Erc721Owner>;
  erc721Owners: Array<Erc721Owner>;
  erc721OwnersConnection: Erc721OwnersConnection;
  erc721TokenById?: Maybe<Erc721Token>;
  /** @deprecated Use erc721TokenById */
  erc721TokenByUniqueInput?: Maybe<Erc721Token>;
  erc721Tokens: Array<Erc721Token>;
  erc721TokensConnection: Erc721TokensConnection;
  erc721TransferById?: Maybe<Erc721Transfer>;
  /** @deprecated Use erc721TransferById */
  erc721TransferByUniqueInput?: Maybe<Erc721Transfer>;
  erc721Transfers: Array<Erc721Transfer>;
  erc721TransfersConnection: Erc721TransfersConnection;
  erc1155ContractById?: Maybe<Erc1155Contract>;
  /** @deprecated Use erc1155ContractById */
  erc1155ContractByUniqueInput?: Maybe<Erc1155Contract>;
  erc1155Contracts: Array<Erc1155Contract>;
  erc1155ContractsConnection: Erc1155ContractsConnection;
  erc1155OwnerById?: Maybe<Erc1155Owner>;
  /** @deprecated Use erc1155OwnerById */
  erc1155OwnerByUniqueInput?: Maybe<Erc1155Owner>;
  erc1155Owners: Array<Erc1155Owner>;
  erc1155OwnersConnection: Erc1155OwnersConnection;
  erc1155TokenById?: Maybe<Erc1155Token>;
  /** @deprecated Use erc1155TokenById */
  erc1155TokenByUniqueInput?: Maybe<Erc1155Token>;
  erc1155TokenOwnerById?: Maybe<Erc1155TokenOwner>;
  /** @deprecated Use erc1155TokenOwnerById */
  erc1155TokenOwnerByUniqueInput?: Maybe<Erc1155TokenOwner>;
  erc1155TokenOwners: Array<Erc1155TokenOwner>;
  erc1155TokenOwnersConnection: Erc1155TokenOwnersConnection;
  erc1155Tokens: Array<Erc1155Token>;
  erc1155TokensConnection: Erc1155TokensConnection;
  erc1155TransferById?: Maybe<Erc1155Transfer>;
  /** @deprecated Use erc1155TransferById */
  erc1155TransferByUniqueInput?: Maybe<Erc1155Transfer>;
  erc1155Transfers: Array<Erc1155Transfer>;
  erc1155TransfersConnection: Erc1155TransfersConnection;
  metadata: Array<Metadata>;
  metadataById?: Maybe<Metadata>;
  /** @deprecated Use metadataById */
  metadataByUniqueInput?: Maybe<Metadata>;
  metadataConnection: MetadataConnection;
  squidStatus?: Maybe<SquidStatus>;
};


export type QueryErc721ContractByIdArgs = {
  id: Scalars['String'];
};


export type QueryErc721ContractByUniqueInputArgs = {
  where: WhereIdInput;
};


export type QueryErc721ContractsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<Erc721ContractOrderByInput>>;
  where?: InputMaybe<Erc721ContractWhereInput>;
};


export type QueryErc721ContractsConnectionArgs = {
  after?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy: Array<Erc721ContractOrderByInput>;
  where?: InputMaybe<Erc721ContractWhereInput>;
};


export type QueryErc721OwnerByIdArgs = {
  id: Scalars['String'];
};


export type QueryErc721OwnerByUniqueInputArgs = {
  where: WhereIdInput;
};


export type QueryErc721OwnersArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<Erc721OwnerOrderByInput>>;
  where?: InputMaybe<Erc721OwnerWhereInput>;
};


export type QueryErc721OwnersConnectionArgs = {
  after?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy: Array<Erc721OwnerOrderByInput>;
  where?: InputMaybe<Erc721OwnerWhereInput>;
};


export type QueryErc721TokenByIdArgs = {
  id: Scalars['String'];
};


export type QueryErc721TokenByUniqueInputArgs = {
  where: WhereIdInput;
};


export type QueryErc721TokensArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<Erc721TokenOrderByInput>>;
  where?: InputMaybe<Erc721TokenWhereInput>;
};


export type QueryErc721TokensConnectionArgs = {
  after?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy: Array<Erc721TokenOrderByInput>;
  where?: InputMaybe<Erc721TokenWhereInput>;
};


export type QueryErc721TransferByIdArgs = {
  id: Scalars['String'];
};


export type QueryErc721TransferByUniqueInputArgs = {
  where: WhereIdInput;
};


export type QueryErc721TransfersArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<Erc721TransferOrderByInput>>;
  where?: InputMaybe<Erc721TransferWhereInput>;
};


export type QueryErc721TransfersConnectionArgs = {
  after?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy: Array<Erc721TransferOrderByInput>;
  where?: InputMaybe<Erc721TransferWhereInput>;
};


export type QueryErc1155ContractByIdArgs = {
  id: Scalars['String'];
};


export type QueryErc1155ContractByUniqueInputArgs = {
  where: WhereIdInput;
};


export type QueryErc1155ContractsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<Erc1155ContractOrderByInput>>;
  where?: InputMaybe<Erc1155ContractWhereInput>;
};


export type QueryErc1155ContractsConnectionArgs = {
  after?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy: Array<Erc1155ContractOrderByInput>;
  where?: InputMaybe<Erc1155ContractWhereInput>;
};


export type QueryErc1155OwnerByIdArgs = {
  id: Scalars['String'];
};


export type QueryErc1155OwnerByUniqueInputArgs = {
  where: WhereIdInput;
};


export type QueryErc1155OwnersArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<Erc1155OwnerOrderByInput>>;
  where?: InputMaybe<Erc1155OwnerWhereInput>;
};


export type QueryErc1155OwnersConnectionArgs = {
  after?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy: Array<Erc1155OwnerOrderByInput>;
  where?: InputMaybe<Erc1155OwnerWhereInput>;
};


export type QueryErc1155TokenByIdArgs = {
  id: Scalars['String'];
};


export type QueryErc1155TokenByUniqueInputArgs = {
  where: WhereIdInput;
};


export type QueryErc1155TokenOwnerByIdArgs = {
  id: Scalars['String'];
};


export type QueryErc1155TokenOwnerByUniqueInputArgs = {
  where: WhereIdInput;
};


export type QueryErc1155TokenOwnersArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<Erc1155TokenOwnerOrderByInput>>;
  where?: InputMaybe<Erc1155TokenOwnerWhereInput>;
};


export type QueryErc1155TokenOwnersConnectionArgs = {
  after?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy: Array<Erc1155TokenOwnerOrderByInput>;
  where?: InputMaybe<Erc1155TokenOwnerWhereInput>;
};


export type QueryErc1155TokensArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<Erc1155TokenOrderByInput>>;
  where?: InputMaybe<Erc1155TokenWhereInput>;
};


export type QueryErc1155TokensConnectionArgs = {
  after?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy: Array<Erc1155TokenOrderByInput>;
  where?: InputMaybe<Erc1155TokenWhereInput>;
};


export type QueryErc1155TransferByIdArgs = {
  id: Scalars['String'];
};


export type QueryErc1155TransferByUniqueInputArgs = {
  where: WhereIdInput;
};


export type QueryErc1155TransfersArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<Erc1155TransferOrderByInput>>;
  where?: InputMaybe<Erc1155TransferWhereInput>;
};


export type QueryErc1155TransfersConnectionArgs = {
  after?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy: Array<Erc1155TransferOrderByInput>;
  where?: InputMaybe<Erc1155TransferWhereInput>;
};


export type QueryMetadataArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<MetadataOrderByInput>>;
  where?: InputMaybe<MetadataWhereInput>;
};


export type QueryMetadataByIdArgs = {
  id: Scalars['String'];
};


export type QueryMetadataByUniqueInputArgs = {
  where: WhereIdInput;
};


export type QueryMetadataConnectionArgs = {
  after?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy: Array<MetadataOrderByInput>;
  where?: InputMaybe<MetadataWhereInput>;
};

export type SquidStatus = {
  __typename?: 'SquidStatus';
  /** The height of the processed part of the chain */
  height?: Maybe<Scalars['Int']>;
};

export type WhereIdInput = {
  id: Scalars['String'];
};

export type GetOnChainTokensQueryVariables = Exact<{
  owner: Scalars['String'];
}>;


export type GetOnChainTokensQuery = { __typename?: 'Query', erc1155TokenOwners: Array<{ __typename?: 'ERC1155TokenOwner', id: string, balance: any, token: { __typename?: 'ERC1155Token', numericId: any, id: string, metadata?: { __typename?: 'Metadata', image?: string | null, layers?: Array<string> | null, name?: string | null, type?: string | null, description?: string | null, composite?: boolean | null, attributes?: Array<{ __typename?: 'Attribute', displayType?: string | null, traitType: string, value: string }> | null } | null, contract?: { __typename?: 'ERC1155Contract', address?: string | null } | null, transfers: Array<{ __typename?: 'ERC1155Transfer', id: string, transactionHash: string, to?: { __typename?: 'ERC1155Owner', id: string } | null, from?: { __typename?: 'ERC1155Owner', id: string } | null }> } }>, erc721Tokens: Array<{ __typename?: 'ERC721Token', numericId: any, id: string, metadata?: { __typename?: 'Metadata', image?: string | null, layers?: Array<string> | null, name?: string | null, type?: string | null, description?: string | null, composite?: boolean | null, attributes?: Array<{ __typename?: 'Attribute', displayType?: string | null, traitType: string, value: string }> | null } | null, contract: { __typename?: 'ERC721Contract', address?: string | null } }> };


export const GetOnChainTokensDocument = `
    query getOnChainTokens($owner: String!) {
  erc1155TokenOwners(where: {owner: {id_containsInsensitive: $owner}}) {
    id
    token {
      numericId
      metadata {
        image
        layers
        name
        type
        description
        composite
        attributes {
          displayType
          traitType
          value
        }
      }
      id
      contract {
        address
      }
      transfers(
        where: {from: {id_containsInsensitive: $owner}, OR: {to: {id_containsInsensitive: $owner}}}
        orderBy: block_DESC
        limit: 1
      ) {
        id
        to {
          id
        }
        from {
          id
        }
        transactionHash
      }
    }
    balance
  }
  erc721Tokens(where: {owner: {id_containsInsensitive: $owner}}) {
    numericId
    metadata {
      image
      layers
      name
      type
      description
      composite
      attributes {
        displayType
        traitType
        value
      }
    }
    id
    contract {
      address
    }
  }
}
    `;

const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    getOnChainTokens: build.query<GetOnChainTokensQuery, GetOnChainTokensQueryVariables>({
      query: (variables) => ({ document: GetOnChainTokensDocument, variables })
    }),
  }),
});

export { injectedRtkApi as api };
export const { useGetOnChainTokensQuery, useLazyGetOnChainTokensQuery } = injectedRtkApi;

