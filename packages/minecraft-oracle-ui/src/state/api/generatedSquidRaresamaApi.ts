import { api } from './baseGeneratedSquidRaresamaApi';
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

export type Contract = {
  __typename?: 'Contract';
  artist?: Maybe<Scalars['String']>;
  artistUrl?: Maybe<Scalars['String']>;
  contractURI?: Maybe<Scalars['String']>;
  contractURIUpdated?: Maybe<Scalars['BigInt']>;
  decimals?: Maybe<Scalars['Int']>;
  description?: Maybe<Scalars['String']>;
  externalLink?: Maybe<Scalars['String']>;
  factoryId: Scalars['BigInt'];
  id: Scalars['String'];
  image?: Maybe<Scalars['String']>;
  metadataName?: Maybe<Scalars['String']>;
  mintedTokens: Array<Token>;
  name?: Maybe<Scalars['String']>;
  startBlock: Scalars['Int'];
  symbol?: Maybe<Scalars['String']>;
  totalSupply: Scalars['BigInt'];
  uniqueOwnersCount: Scalars['Int'];
};


export type ContractMintedTokensArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<TokenOrderByInput>>;
  where?: InputMaybe<TokenWhereInput>;
};

export type ContractEdge = {
  __typename?: 'ContractEdge';
  cursor: Scalars['String'];
  node: Contract;
};

export enum ContractOrderByInput {
  artistUrl_ASC = 'artistUrl_ASC',
  artistUrl_DESC = 'artistUrl_DESC',
  artist_ASC = 'artist_ASC',
  artist_DESC = 'artist_DESC',
  contractURIUpdated_ASC = 'contractURIUpdated_ASC',
  contractURIUpdated_DESC = 'contractURIUpdated_DESC',
  contractURI_ASC = 'contractURI_ASC',
  contractURI_DESC = 'contractURI_DESC',
  decimals_ASC = 'decimals_ASC',
  decimals_DESC = 'decimals_DESC',
  description_ASC = 'description_ASC',
  description_DESC = 'description_DESC',
  externalLink_ASC = 'externalLink_ASC',
  externalLink_DESC = 'externalLink_DESC',
  factoryId_ASC = 'factoryId_ASC',
  factoryId_DESC = 'factoryId_DESC',
  id_ASC = 'id_ASC',
  id_DESC = 'id_DESC',
  image_ASC = 'image_ASC',
  image_DESC = 'image_DESC',
  metadataName_ASC = 'metadataName_ASC',
  metadataName_DESC = 'metadataName_DESC',
  name_ASC = 'name_ASC',
  name_DESC = 'name_DESC',
  startBlock_ASC = 'startBlock_ASC',
  startBlock_DESC = 'startBlock_DESC',
  symbol_ASC = 'symbol_ASC',
  symbol_DESC = 'symbol_DESC',
  totalSupply_ASC = 'totalSupply_ASC',
  totalSupply_DESC = 'totalSupply_DESC',
  uniqueOwnersCount_ASC = 'uniqueOwnersCount_ASC',
  uniqueOwnersCount_DESC = 'uniqueOwnersCount_DESC'
}

export type ContractWhereInput = {
  AND?: InputMaybe<Array<ContractWhereInput>>;
  OR?: InputMaybe<Array<ContractWhereInput>>;
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
  factoryId_eq?: InputMaybe<Scalars['BigInt']>;
  factoryId_gt?: InputMaybe<Scalars['BigInt']>;
  factoryId_gte?: InputMaybe<Scalars['BigInt']>;
  factoryId_in?: InputMaybe<Array<Scalars['BigInt']>>;
  factoryId_isNull?: InputMaybe<Scalars['Boolean']>;
  factoryId_lt?: InputMaybe<Scalars['BigInt']>;
  factoryId_lte?: InputMaybe<Scalars['BigInt']>;
  factoryId_not_eq?: InputMaybe<Scalars['BigInt']>;
  factoryId_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
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
  mintedTokens_every?: InputMaybe<TokenWhereInput>;
  mintedTokens_none?: InputMaybe<TokenWhereInput>;
  mintedTokens_some?: InputMaybe<TokenWhereInput>;
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
  uniqueOwnersCount_eq?: InputMaybe<Scalars['Int']>;
  uniqueOwnersCount_gt?: InputMaybe<Scalars['Int']>;
  uniqueOwnersCount_gte?: InputMaybe<Scalars['Int']>;
  uniqueOwnersCount_in?: InputMaybe<Array<Scalars['Int']>>;
  uniqueOwnersCount_isNull?: InputMaybe<Scalars['Boolean']>;
  uniqueOwnersCount_lt?: InputMaybe<Scalars['Int']>;
  uniqueOwnersCount_lte?: InputMaybe<Scalars['Int']>;
  uniqueOwnersCount_not_eq?: InputMaybe<Scalars['Int']>;
  uniqueOwnersCount_not_in?: InputMaybe<Array<Scalars['Int']>>;
};

export type ContractsConnection = {
  __typename?: 'ContractsConnection';
  edges: Array<ContractEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export enum Direction {
  FROM = 'FROM',
  TO = 'TO'
}

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
  artistUrl_ASC = 'artistUrl_ASC',
  artistUrl_DESC = 'artistUrl_DESC',
  artist_ASC = 'artist_ASC',
  artist_DESC = 'artist_DESC',
  composite_ASC = 'composite_ASC',
  composite_DESC = 'composite_DESC',
  description_ASC = 'description_ASC',
  description_DESC = 'description_DESC',
  externalUrl_ASC = 'externalUrl_ASC',
  externalUrl_DESC = 'externalUrl_DESC',
  id_ASC = 'id_ASC',
  id_DESC = 'id_DESC',
  image_ASC = 'image_ASC',
  image_DESC = 'image_DESC',
  name_ASC = 'name_ASC',
  name_DESC = 'name_DESC',
  type_ASC = 'type_ASC',
  type_DESC = 'type_DESC'
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

export type Owner = {
  __typename?: 'Owner';
  balance: Scalars['BigInt'];
  id: Scalars['String'];
  ownedTokens: Array<Token>;
  totalCollectionNfts: Array<TotalOwnedNft>;
  transfers: Array<OwnerTransfer>;
};


export type OwnerOwnedTokensArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<TokenOrderByInput>>;
  where?: InputMaybe<TokenWhereInput>;
};


export type OwnerTransfersArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<OwnerTransferOrderByInput>>;
  where?: InputMaybe<OwnerTransferWhereInput>;
};

export type OwnerEdge = {
  __typename?: 'OwnerEdge';
  cursor: Scalars['String'];
  node: Owner;
};

export enum OwnerOrderByInput {
  balance_ASC = 'balance_ASC',
  balance_DESC = 'balance_DESC',
  id_ASC = 'id_ASC',
  id_DESC = 'id_DESC'
}

export type OwnerTransfer = {
  __typename?: 'OwnerTransfer';
  direction: Direction;
  id: Scalars['String'];
  owner?: Maybe<Owner>;
  transfer: Transfer;
};

export type OwnerTransferEdge = {
  __typename?: 'OwnerTransferEdge';
  cursor: Scalars['String'];
  node: OwnerTransfer;
};

export enum OwnerTransferOrderByInput {
  direction_ASC = 'direction_ASC',
  direction_DESC = 'direction_DESC',
  id_ASC = 'id_ASC',
  id_DESC = 'id_DESC',
  owner_balance_ASC = 'owner_balance_ASC',
  owner_balance_DESC = 'owner_balance_DESC',
  owner_id_ASC = 'owner_id_ASC',
  owner_id_DESC = 'owner_id_DESC',
  transfer_block_ASC = 'transfer_block_ASC',
  transfer_block_DESC = 'transfer_block_DESC',
  transfer_id_ASC = 'transfer_id_ASC',
  transfer_id_DESC = 'transfer_id_DESC',
  transfer_timestamp_ASC = 'transfer_timestamp_ASC',
  transfer_timestamp_DESC = 'transfer_timestamp_DESC',
  transfer_transactionHash_ASC = 'transfer_transactionHash_ASC',
  transfer_transactionHash_DESC = 'transfer_transactionHash_DESC'
}

export type OwnerTransferWhereInput = {
  AND?: InputMaybe<Array<OwnerTransferWhereInput>>;
  OR?: InputMaybe<Array<OwnerTransferWhereInput>>;
  direction_eq?: InputMaybe<Direction>;
  direction_in?: InputMaybe<Array<Direction>>;
  direction_isNull?: InputMaybe<Scalars['Boolean']>;
  direction_not_eq?: InputMaybe<Direction>;
  direction_not_in?: InputMaybe<Array<Direction>>;
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
  owner?: InputMaybe<OwnerWhereInput>;
  owner_isNull?: InputMaybe<Scalars['Boolean']>;
  transfer?: InputMaybe<TransferWhereInput>;
  transfer_isNull?: InputMaybe<Scalars['Boolean']>;
};

export type OwnerTransfersConnection = {
  __typename?: 'OwnerTransfersConnection';
  edges: Array<OwnerTransferEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type OwnerWhereInput = {
  AND?: InputMaybe<Array<OwnerWhereInput>>;
  OR?: InputMaybe<Array<OwnerWhereInput>>;
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
  ownedTokens_every?: InputMaybe<TokenWhereInput>;
  ownedTokens_none?: InputMaybe<TokenWhereInput>;
  ownedTokens_some?: InputMaybe<TokenWhereInput>;
  totalCollectionNfts_isNull?: InputMaybe<Scalars['Boolean']>;
  transfers_every?: InputMaybe<OwnerTransferWhereInput>;
  transfers_none?: InputMaybe<OwnerTransferWhereInput>;
  transfers_some?: InputMaybe<OwnerTransferWhereInput>;
};

export type OwnersConnection = {
  __typename?: 'OwnersConnection';
  edges: Array<OwnerEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
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
  contractById?: Maybe<Contract>;
  /** @deprecated Use contractById */
  contractByUniqueInput?: Maybe<Contract>;
  contracts: Array<Contract>;
  contractsConnection: ContractsConnection;
  metadata: Array<Metadata>;
  metadataById?: Maybe<Metadata>;
  /** @deprecated Use metadataById */
  metadataByUniqueInput?: Maybe<Metadata>;
  metadataConnection: MetadataConnection;
  ownerById?: Maybe<Owner>;
  /** @deprecated Use ownerById */
  ownerByUniqueInput?: Maybe<Owner>;
  ownerTransferById?: Maybe<OwnerTransfer>;
  /** @deprecated Use ownerTransferById */
  ownerTransferByUniqueInput?: Maybe<OwnerTransfer>;
  ownerTransfers: Array<OwnerTransfer>;
  ownerTransfersConnection: OwnerTransfersConnection;
  owners: Array<Owner>;
  ownersConnection: OwnersConnection;
  squidStatus?: Maybe<SquidStatus>;
  tokenById?: Maybe<Token>;
  /** @deprecated Use tokenById */
  tokenByUniqueInput?: Maybe<Token>;
  tokens: Array<Token>;
  tokensConnection: TokensConnection;
  transferById?: Maybe<Transfer>;
  /** @deprecated Use transferById */
  transferByUniqueInput?: Maybe<Transfer>;
  transfers: Array<Transfer>;
  transfersConnection: TransfersConnection;
};


export type QueryContractByIdArgs = {
  id: Scalars['String'];
};


export type QueryContractByUniqueInputArgs = {
  where: WhereIdInput;
};


export type QueryContractsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<ContractOrderByInput>>;
  where?: InputMaybe<ContractWhereInput>;
};


export type QueryContractsConnectionArgs = {
  after?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy: Array<ContractOrderByInput>;
  where?: InputMaybe<ContractWhereInput>;
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


export type QueryOwnerByIdArgs = {
  id: Scalars['String'];
};


export type QueryOwnerByUniqueInputArgs = {
  where: WhereIdInput;
};


export type QueryOwnerTransferByIdArgs = {
  id: Scalars['String'];
};


export type QueryOwnerTransferByUniqueInputArgs = {
  where: WhereIdInput;
};


export type QueryOwnerTransfersArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<OwnerTransferOrderByInput>>;
  where?: InputMaybe<OwnerTransferWhereInput>;
};


export type QueryOwnerTransfersConnectionArgs = {
  after?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy: Array<OwnerTransferOrderByInput>;
  where?: InputMaybe<OwnerTransferWhereInput>;
};


export type QueryOwnersArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<OwnerOrderByInput>>;
  where?: InputMaybe<OwnerWhereInput>;
};


export type QueryOwnersConnectionArgs = {
  after?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy: Array<OwnerOrderByInput>;
  where?: InputMaybe<OwnerWhereInput>;
};


export type QueryTokenByIdArgs = {
  id: Scalars['String'];
};


export type QueryTokenByUniqueInputArgs = {
  where: WhereIdInput;
};


export type QueryTokensArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<TokenOrderByInput>>;
  where?: InputMaybe<TokenWhereInput>;
};


export type QueryTokensConnectionArgs = {
  after?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy: Array<TokenOrderByInput>;
  where?: InputMaybe<TokenWhereInput>;
};


export type QueryTransferByIdArgs = {
  id: Scalars['String'];
};


export type QueryTransferByUniqueInputArgs = {
  where: WhereIdInput;
};


export type QueryTransfersArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<TransferOrderByInput>>;
  where?: InputMaybe<TransferWhereInput>;
};


export type QueryTransfersConnectionArgs = {
  after?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy: Array<TransferOrderByInput>;
  where?: InputMaybe<TransferWhereInput>;
};

export type SquidStatus = {
  __typename?: 'SquidStatus';
  /** The height of the processed part of the chain */
  height?: Maybe<Scalars['Int']>;
};

export type Token = {
  __typename?: 'Token';
  compositeTokenUri?: Maybe<Scalars['String']>;
  contract: Contract;
  createdAt: Scalars['BigInt'];
  id: Scalars['String'];
  metadata?: Maybe<Metadata>;
  numericId: Scalars['BigInt'];
  owner?: Maybe<Owner>;
  tokenUri?: Maybe<Scalars['String']>;
  transfers: Array<Transfer>;
  updatedAt: Scalars['BigInt'];
};


export type TokenTransfersArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<TransferOrderByInput>>;
  where?: InputMaybe<TransferWhereInput>;
};

export type TokenEdge = {
  __typename?: 'TokenEdge';
  cursor: Scalars['String'];
  node: Token;
};

export enum TokenOrderByInput {
  compositeTokenUri_ASC = 'compositeTokenUri_ASC',
  compositeTokenUri_DESC = 'compositeTokenUri_DESC',
  contract_artistUrl_ASC = 'contract_artistUrl_ASC',
  contract_artistUrl_DESC = 'contract_artistUrl_DESC',
  contract_artist_ASC = 'contract_artist_ASC',
  contract_artist_DESC = 'contract_artist_DESC',
  contract_contractURIUpdated_ASC = 'contract_contractURIUpdated_ASC',
  contract_contractURIUpdated_DESC = 'contract_contractURIUpdated_DESC',
  contract_contractURI_ASC = 'contract_contractURI_ASC',
  contract_contractURI_DESC = 'contract_contractURI_DESC',
  contract_decimals_ASC = 'contract_decimals_ASC',
  contract_decimals_DESC = 'contract_decimals_DESC',
  contract_description_ASC = 'contract_description_ASC',
  contract_description_DESC = 'contract_description_DESC',
  contract_externalLink_ASC = 'contract_externalLink_ASC',
  contract_externalLink_DESC = 'contract_externalLink_DESC',
  contract_factoryId_ASC = 'contract_factoryId_ASC',
  contract_factoryId_DESC = 'contract_factoryId_DESC',
  contract_id_ASC = 'contract_id_ASC',
  contract_id_DESC = 'contract_id_DESC',
  contract_image_ASC = 'contract_image_ASC',
  contract_image_DESC = 'contract_image_DESC',
  contract_metadataName_ASC = 'contract_metadataName_ASC',
  contract_metadataName_DESC = 'contract_metadataName_DESC',
  contract_name_ASC = 'contract_name_ASC',
  contract_name_DESC = 'contract_name_DESC',
  contract_startBlock_ASC = 'contract_startBlock_ASC',
  contract_startBlock_DESC = 'contract_startBlock_DESC',
  contract_symbol_ASC = 'contract_symbol_ASC',
  contract_symbol_DESC = 'contract_symbol_DESC',
  contract_totalSupply_ASC = 'contract_totalSupply_ASC',
  contract_totalSupply_DESC = 'contract_totalSupply_DESC',
  contract_uniqueOwnersCount_ASC = 'contract_uniqueOwnersCount_ASC',
  contract_uniqueOwnersCount_DESC = 'contract_uniqueOwnersCount_DESC',
  createdAt_ASC = 'createdAt_ASC',
  createdAt_DESC = 'createdAt_DESC',
  id_ASC = 'id_ASC',
  id_DESC = 'id_DESC',
  metadata_artistUrl_ASC = 'metadata_artistUrl_ASC',
  metadata_artistUrl_DESC = 'metadata_artistUrl_DESC',
  metadata_artist_ASC = 'metadata_artist_ASC',
  metadata_artist_DESC = 'metadata_artist_DESC',
  metadata_composite_ASC = 'metadata_composite_ASC',
  metadata_composite_DESC = 'metadata_composite_DESC',
  metadata_description_ASC = 'metadata_description_ASC',
  metadata_description_DESC = 'metadata_description_DESC',
  metadata_externalUrl_ASC = 'metadata_externalUrl_ASC',
  metadata_externalUrl_DESC = 'metadata_externalUrl_DESC',
  metadata_id_ASC = 'metadata_id_ASC',
  metadata_id_DESC = 'metadata_id_DESC',
  metadata_image_ASC = 'metadata_image_ASC',
  metadata_image_DESC = 'metadata_image_DESC',
  metadata_name_ASC = 'metadata_name_ASC',
  metadata_name_DESC = 'metadata_name_DESC',
  metadata_type_ASC = 'metadata_type_ASC',
  metadata_type_DESC = 'metadata_type_DESC',
  numericId_ASC = 'numericId_ASC',
  numericId_DESC = 'numericId_DESC',
  owner_balance_ASC = 'owner_balance_ASC',
  owner_balance_DESC = 'owner_balance_DESC',
  owner_id_ASC = 'owner_id_ASC',
  owner_id_DESC = 'owner_id_DESC',
  tokenUri_ASC = 'tokenUri_ASC',
  tokenUri_DESC = 'tokenUri_DESC',
  updatedAt_ASC = 'updatedAt_ASC',
  updatedAt_DESC = 'updatedAt_DESC'
}

export type TokenWhereInput = {
  AND?: InputMaybe<Array<TokenWhereInput>>;
  OR?: InputMaybe<Array<TokenWhereInput>>;
  compositeTokenUri_contains?: InputMaybe<Scalars['String']>;
  compositeTokenUri_containsInsensitive?: InputMaybe<Scalars['String']>;
  compositeTokenUri_endsWith?: InputMaybe<Scalars['String']>;
  compositeTokenUri_eq?: InputMaybe<Scalars['String']>;
  compositeTokenUri_gt?: InputMaybe<Scalars['String']>;
  compositeTokenUri_gte?: InputMaybe<Scalars['String']>;
  compositeTokenUri_in?: InputMaybe<Array<Scalars['String']>>;
  compositeTokenUri_isNull?: InputMaybe<Scalars['Boolean']>;
  compositeTokenUri_lt?: InputMaybe<Scalars['String']>;
  compositeTokenUri_lte?: InputMaybe<Scalars['String']>;
  compositeTokenUri_not_contains?: InputMaybe<Scalars['String']>;
  compositeTokenUri_not_containsInsensitive?: InputMaybe<Scalars['String']>;
  compositeTokenUri_not_endsWith?: InputMaybe<Scalars['String']>;
  compositeTokenUri_not_eq?: InputMaybe<Scalars['String']>;
  compositeTokenUri_not_in?: InputMaybe<Array<Scalars['String']>>;
  compositeTokenUri_not_startsWith?: InputMaybe<Scalars['String']>;
  compositeTokenUri_startsWith?: InputMaybe<Scalars['String']>;
  contract?: InputMaybe<ContractWhereInput>;
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
  owner?: InputMaybe<OwnerWhereInput>;
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
  transfers_every?: InputMaybe<TransferWhereInput>;
  transfers_none?: InputMaybe<TransferWhereInput>;
  transfers_some?: InputMaybe<TransferWhereInput>;
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

export type TokensConnection = {
  __typename?: 'TokensConnection';
  edges: Array<TokenEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type TotalOwnedNft = {
  __typename?: 'TotalOwnedNft';
  amount: Scalars['Int'];
  conctractAddress: Scalars['String'];
};

export type Transfer = {
  __typename?: 'Transfer';
  block: Scalars['Int'];
  from?: Maybe<Owner>;
  id: Scalars['String'];
  timestamp: Scalars['BigInt'];
  to?: Maybe<Owner>;
  token: Token;
  transactionHash: Scalars['String'];
};

export type TransferEdge = {
  __typename?: 'TransferEdge';
  cursor: Scalars['String'];
  node: Transfer;
};

export enum TransferOrderByInput {
  block_ASC = 'block_ASC',
  block_DESC = 'block_DESC',
  from_balance_ASC = 'from_balance_ASC',
  from_balance_DESC = 'from_balance_DESC',
  from_id_ASC = 'from_id_ASC',
  from_id_DESC = 'from_id_DESC',
  id_ASC = 'id_ASC',
  id_DESC = 'id_DESC',
  timestamp_ASC = 'timestamp_ASC',
  timestamp_DESC = 'timestamp_DESC',
  to_balance_ASC = 'to_balance_ASC',
  to_balance_DESC = 'to_balance_DESC',
  to_id_ASC = 'to_id_ASC',
  to_id_DESC = 'to_id_DESC',
  token_compositeTokenUri_ASC = 'token_compositeTokenUri_ASC',
  token_compositeTokenUri_DESC = 'token_compositeTokenUri_DESC',
  token_createdAt_ASC = 'token_createdAt_ASC',
  token_createdAt_DESC = 'token_createdAt_DESC',
  token_id_ASC = 'token_id_ASC',
  token_id_DESC = 'token_id_DESC',
  token_numericId_ASC = 'token_numericId_ASC',
  token_numericId_DESC = 'token_numericId_DESC',
  token_tokenUri_ASC = 'token_tokenUri_ASC',
  token_tokenUri_DESC = 'token_tokenUri_DESC',
  token_updatedAt_ASC = 'token_updatedAt_ASC',
  token_updatedAt_DESC = 'token_updatedAt_DESC',
  transactionHash_ASC = 'transactionHash_ASC',
  transactionHash_DESC = 'transactionHash_DESC'
}

export type TransferWhereInput = {
  AND?: InputMaybe<Array<TransferWhereInput>>;
  OR?: InputMaybe<Array<TransferWhereInput>>;
  block_eq?: InputMaybe<Scalars['Int']>;
  block_gt?: InputMaybe<Scalars['Int']>;
  block_gte?: InputMaybe<Scalars['Int']>;
  block_in?: InputMaybe<Array<Scalars['Int']>>;
  block_isNull?: InputMaybe<Scalars['Boolean']>;
  block_lt?: InputMaybe<Scalars['Int']>;
  block_lte?: InputMaybe<Scalars['Int']>;
  block_not_eq?: InputMaybe<Scalars['Int']>;
  block_not_in?: InputMaybe<Array<Scalars['Int']>>;
  from?: InputMaybe<OwnerWhereInput>;
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
  to?: InputMaybe<OwnerWhereInput>;
  to_isNull?: InputMaybe<Scalars['Boolean']>;
  token?: InputMaybe<TokenWhereInput>;
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

export type TransfersConnection = {
  __typename?: 'TransfersConnection';
  edges: Array<TransferEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type WhereIdInput = {
  id: Scalars['String'];
};

export type GetRaresamaMetadataQueryVariables = Exact<{
  where?: InputMaybe<TokenWhereInput>;
}>;


export type GetRaresamaMetadataQuery = { __typename?: 'Query', tokens: Array<{ __typename?: 'Token', numericId: any, metadata?: { __typename?: 'Metadata', type?: string | null, name?: string | null, layers?: Array<string> | null, image?: string | null, description?: string | null, composite?: boolean | null, attributes?: Array<{ __typename?: 'Attribute', value: string, traitType: string, displayType?: string | null }> | null } | null, contract: { __typename?: 'Contract', address: string } }> };

export type GetRaresamaOnChainTokensQueryVariables = Exact<{
  where?: InputMaybe<TokenWhereInput>;
}>;


export type GetRaresamaOnChainTokensQuery = { __typename?: 'Query', tokens: Array<{ __typename?: 'Token', numericId: any, id: string, metadata?: { __typename?: 'Metadata', image?: string | null, layers?: Array<string> | null, name?: string | null, type?: string | null, description?: string | null, composite?: boolean | null, attributes?: Array<{ __typename?: 'Attribute', displayType?: string | null, traitType: string, value: string }> | null } | null, contract: { __typename?: 'Contract', address: string } }> };


export const GetRaresamaMetadataDocument = `
    query getRaresamaMetadata($where: TokenWhereInput) {
  tokens(where: $where, limit: 1000) {
    metadata {
      type
      name
      layers
      image
      description
      composite
      attributes {
        value
        traitType
        displayType
      }
    }
    numericId
    contract {
      address: id
    }
  }
}
    `;
export const GetRaresamaOnChainTokensDocument = `
    query getRaresamaOnChainTokens($where: TokenWhereInput) {
  tokens(where: $where, limit: 1000) {
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
      address: id
    }
  }
}
    `;

const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    getRaresamaMetadata: build.query<GetRaresamaMetadataQuery, GetRaresamaMetadataQueryVariables | void>({
      query: (variables) => ({ document: GetRaresamaMetadataDocument, variables })
    }),
    getRaresamaOnChainTokens: build.query<GetRaresamaOnChainTokensQuery, GetRaresamaOnChainTokensQueryVariables | void>({
      query: (variables) => ({ document: GetRaresamaOnChainTokensDocument, variables })
    }),
  }),
});

export { injectedRtkApi as api };
export const { useGetRaresamaMetadataQuery, useLazyGetRaresamaMetadataQuery, useGetRaresamaOnChainTokensQuery, useLazyGetRaresamaOnChainTokensQuery } = injectedRtkApi;

