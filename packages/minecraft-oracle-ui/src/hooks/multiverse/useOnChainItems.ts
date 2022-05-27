import { BigNumber } from '@ethersproject/bignumber';
import { request } from 'graphql-request';
import { useActiveWeb3React } from 'hooks/useActiveWeb3React/useActiveWeb3React';
import { useCallback, useEffect, useState } from 'react';
import { Asset } from 'hooks/marketplace/types';
import { StaticTokenData, useTokenStaticDataCallbackArray } from 'hooks/useTokenStaticDataCallback/useTokenStaticDataCallback';
import { QUERY_USER_ERC721 } from 'subgraph/erc721Queries';
import { getAssetEntityId, StringAssetType } from 'utils/subgraph';
import { TokenMeta } from 'hooks/useFetchTokenUri.ts/useFetchTokenUri.types';
import { QUERY_USER_ERC1155 } from 'subgraph/erc1155Queries';
import { useRawAssetsFromList } from 'hooks/useRawAssetsFromList/useRawAssetsFromList';
import { useBlockNumber } from 'state/application/hooks';
import { useFetchUrl } from 'hooks/useFetchUrl/useFetchUrl';
import { useFetchUrlCallback } from 'hooks/useFetchUrlCallback/useFetchUrlCallback';

export interface OwnedTokens {
  id: string;
  ownedTokens: { id: string; contract: { id: string } }[];
}

export interface TokenOwner {
  id: string;
  balance: string;
  token: { id: string, contract: { id: string } };
}

export type AssetWithBalance = Asset & { balance: string | BigNumber }


export interface UserCollection {
  [key: string]: {
    meta: TokenMeta | undefined,
    staticData: StaticTokenData,
    asset: AssetWithBalance,
    enrapturable: boolean;
    importable: boolean;
  }[]
}

export interface UserCollectionWithCompositeMetaOnly {
  [key: string]: {
    meta: TokenMeta | undefined,
    asset: AssetWithBalance,
    enrapturable: boolean;
    importable: boolean;
  }[]
}

export const useOnChainItems = (trigger: string | undefined = undefined) => {
  const { chainId, account } = useActiveWeb3React();
  const blocknumber = useBlockNumber()
  const staticCallback = useTokenStaticDataCallbackArray();
  const rawCollections = useRawAssetsFromList()

  const [onChainItems, setOnChainItems] = useState<UserCollection | undefined>(undefined)

  const fetchUserCollection = useCallback(async () => {

    if (!account) {
      setOnChainItems(undefined)
      return
    }

    const result: UserCollection = {}
    const fetches = rawCollections.map(async (collection) => {

      if (!collection.subgraph) {
        result[collection.display_name] = []
        return;
      }

      let assets: (AssetWithBalance | undefined)[] = []

      // console.log('collection', collection.display_name)

      if (collection.type === 'ERC721') {
        const query = QUERY_USER_ERC721(account)
        const response = await request(collection.subgraph, query);

        console.debug('YOLO fetchUserCollection', response);

        if (!response) {
          result[collection.display_name] = []
          return;
        }

        const ot: OwnedTokens = response.owners?.[0];

        console.log(ot)

        if (!ot) {
          result[collection.display_name] = []
          return;
        }

        assets = ot.ownedTokens.map((x) => {
          const aid = BigNumber.from(x.id).toString();

          if (!!collection.ids && !collection.ids.includes(aid)) {
            console.log('fail')
            return undefined
          }

          return {
            assetId: aid,
            id: getAssetEntityId(x.contract.id, aid),
            assetType: StringAssetType.ERC721,
            assetAddress: x.contract.id,
            balance: '1'
          };
        });

        console.log(assets)
      } else {
        const query = QUERY_USER_ERC1155(account)
        const response = await request(collection.subgraph, query);

        console.debug('YOLO fetchUserCollection', response);

        if (!response) {
          result[collection.display_name] = []
          return;
        }

        const to: TokenOwner[] = response.tokenOwners;

        if (!to) {
          result[collection.display_name] = []
          return;
        }

        assets = to
          .filter(x => x.balance !== '0')
          .map((x) => {
            const aid = BigNumber.from(x.token.id).toString();

            if (!!collection.ids && !collection.ids.includes(aid)) {
              console.log('fail')
              return undefined
            }
            return {
              assetId: aid,
              id: getAssetEntityId(x.token.contract.id, aid),
              assetType: StringAssetType.ERC1155,
              assetAddress: x.token.contract.id,
              balance: x.balance
            };
          })
          .filter(x => !!x)
      }

      const staticDatas = await staticCallback(assets as AssetWithBalance[]);

      const datas = staticDatas.map((sd, i) => {
        return {
          meta: sd.meta,
          staticData: sd.staticData,
          asset: assets[i] as AssetWithBalance,
          enrapturable: collection.enrapturable,
          importable: collection.importable
        };
      });
      result[collection.display_name] = datas
      return
    })

    await Promise.all(fetches)
    setOnChainItems(result)
  },
    [chainId, blocknumber, account, trigger]
  );

  useEffect(() => {
    fetchUserCollection()
  }, [chainId, blocknumber, account, trigger])

  return onChainItems;
};


export const useOnChainItemsWithCompositeMetaAndAssets = (trigger: string | undefined = undefined) => {
  const { chainId, account } = useActiveWeb3React();
  const blocknumber = useBlockNumber()
  const urlCb = useFetchUrlCallback()
  const rawCollections = useRawAssetsFromList()

  const [onChainItems, setOnChainItems] = useState<UserCollectionWithCompositeMetaOnly | undefined>(undefined)

  const fetchUserCollection = useCallback(async () => {

    if (!account) {
      setOnChainItems(undefined)
      return
    }

    const result: UserCollectionWithCompositeMetaOnly = {}
    const fetches = rawCollections.map(async (collection) => {

      if (!collection.subgraph) {
        result[collection.display_name] = []
        return;
      }

      let assets: (AssetWithBalance | undefined)[] = []

      // console.log('collection', collection.display_name)

      if (collection.type === 'ERC721') {
        const query = QUERY_USER_ERC721(account)
        const response = await request(collection.subgraph, query);

        console.debug('YOLO fetchUserCollection', response);

        if (!response) {
          result[collection.display_name] = []
          return;
        }

        const ot: OwnedTokens = response.owners?.[0];

        console.log(ot)

        if (!ot) {
          result[collection.display_name] = []
          return;
        }

        assets = ot.ownedTokens.map((x) => {
          const aid = BigNumber.from(x.id).toString();

          if (!!collection.ids && !collection.ids.includes(aid)) {
            console.log('fail')
            return undefined
          }

          return {
            assetId: aid,
            id: getAssetEntityId(x.contract.id, aid),
            assetType: StringAssetType.ERC721,
            assetAddress: x.contract.id,
            balance: '1'
          };
        });

        console.log(assets)
      } else {
        const query = QUERY_USER_ERC1155(account)
        const response = await request(collection.subgraph, query);

        console.debug('YOLO fetchUserCollection', response);

        if (!response) {
          result[collection.display_name] = []
          return;
        }

        const to: TokenOwner[] = response.tokenOwners;

        if (!to) {
          result[collection.display_name] = []
          return;
        }

        assets = to
          .filter(x => x.balance !== '0')
          .map((x) => {
            const aid = BigNumber.from(x.token.id).toString();

            if (!!collection.ids && !collection.ids.includes(aid)) {
              console.log('fail')
              return undefined
            }
            return {
              assetId: aid,
              id: getAssetEntityId(x.token.contract.id, aid),
              assetType: StringAssetType.ERC1155,
              assetAddress: x.token.contract.id,
              balance: x.balance
            };
          })
          .filter(x => !!x)
      }

      const metas = await Promise.all(assets.map(async (asset) => {
        const meta = await urlCb(`${process.env.REACT_APP_BACKEND_API_URL}/composite/metadata/${chainId}/${asset?.assetAddress}/${asset?.assetId}`, false)
        return meta
      })) as TokenMeta[]

      console.log('FETCH', {metas})

      const datas = metas.map((meta, i) => {
        return {
          meta,
          asset: assets[i] as AssetWithBalance,
          enrapturable: collection.enrapturable,
          importable: collection.importable
        };
      });
      result[collection.display_name] = datas
      return
    })

    await Promise.all(fetches)
    setOnChainItems(result)
  },
    [chainId, blocknumber, account, trigger]
  );

  useEffect(() => {
    fetchUserCollection()
  }, [chainId, blocknumber, account, trigger])

  return onChainItems;
};