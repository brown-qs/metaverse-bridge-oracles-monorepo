import { useActiveWeb3React } from 'hooks';
import { useMemo } from 'react';

import collectionsList from '../../assets/data/collections';

import * as yup from 'yup';
import { StringAssetType } from 'utils/subgraph';

export type RawAsset = {
  ids: string[] | undefined
  chainId: number;
  address: string;
  display_name: string;
  symbol: string;
  type: StringAssetType;
  contractURI: string;
  subgraph: string;
  enrapturable: boolean;
  importable: boolean;
};

export type RawAssetList = {
  name: string;
  assets: RawAsset[];
};

const collectionListSchema = yup.object<RawAssetList>({
  name: yup.string().required(),
  assets: yup
    .array()
    .of(
      yup
        .object<RawAsset>({
          ids: yup.array().of(yup.string()),
          chainId: yup.number().required(),
          address: yup
            .string()
            .isAddress('Expected a valid Ethereum address.')
            .required(),
          display_name: yup.string().required(),
          symbol: yup.string().required(),
          type: yup
            .mixed<StringAssetType>()
            .oneOf([
              StringAssetType.ERC20,
              StringAssetType.ERC1155,
              StringAssetType.ERC721,
            ])
            .required(),
          contractURI: yup.string().required(),
          subgraph: yup.string(),
          enrapturable: yup.boolean(),
          importable: yup.boolean(),
        })
        .required()
    )
    .required(),
});

// returns a variable indicating the state of the approval and a function which approves if necessary or early returns
export function useRawAssetsFromList(): RawAsset[] {
  const { chainId } = useActiveWeb3React();
  const list = useMemo(() => {
    if (!chainId) {
      return [];
    }
    const rawList = collectionListSchema.cast(collectionsList);
    return rawList?.assets.filter((x) => x.chainId === chainId) ?? [];
  }, [chainId]);

  return list;
}
