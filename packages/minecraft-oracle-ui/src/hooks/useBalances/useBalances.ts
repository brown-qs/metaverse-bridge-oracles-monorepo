import { BigNumber } from '@ethersproject/bignumber';
import { ChainId, MULTICALL_NETWORKS, WMOVR_ADDRESS } from '../../constants';
import { tryMultiCallCore } from 'hooks/useMulticall2/useMulticall2';
import {
  useERC1155Contract,
  useERC20Contract,
  useERC721Contract,
  useMulticall2Contract,
} from 'hooks/useContracts/useContracts';
import { StringAssetType } from 'utils/subgraph';
import { FunctionFragment } from 'ethers/lib/utils';
import { useActiveWeb3React } from 'hooks/useActiveWeb3React/useActiveWeb3React';
import { useCallback, useEffect, useState } from 'react';
import { Asset, NewAsset } from 'hooks/marketplace/types';
import { useBlockNumber } from 'state/application/hooks';
import { Web3Provider } from '@ethersproject/providers';
import { Contract } from '@ethersproject/contracts';
import { ERC1155_ABI, ERC20_ABI, ERC721_ABI } from '../../abi/token';

export const useBalances = (assets: (Partial<Asset> | undefined)[]) => {
  const { chainId, account } = useActiveWeb3React();
  const multi = useMulticall2Contract();

  const [balances, setBalances] = useState<(BigNumber | undefined)[]>([]);

  const erc20 = useERC20Contract(
    WMOVR_ADDRESS[ChainId.MOONRIVER] as string,
    true
  );
  const erc1155 = useERC1155Contract(
    WMOVR_ADDRESS[ChainId.MOONRIVER] as string,
    true
  );
  const erc721 = useERC721Contract(
    WMOVR_ADDRESS[ChainId.MOONRIVER] as string,
    true
  );

  const fetchBalances = useCallback(async () => {
    const inputs: any[] = assets
      .map((asset, i) => {
        if (
          !asset ||
          !asset.assetAddress ||
          !asset.assetId ||
          !asset.assetType ||
          !account
        ) {
          return undefined;
        }

        if (asset.assetType?.valueOf() === StringAssetType.NATIVE) {
          return [
            [multi?.interface.getFunction('getEthBalance') as FunctionFragment],
            multi?.address,
            'getEthBalance',
            [account],
          ];
        }

        if (asset.assetType?.valueOf() === StringAssetType.ERC20) {
          return [
            [erc20?.interface.getFunction('balanceOf') as FunctionFragment],
            asset.assetAddress,
            'balanceOf',
            [account],
          ];
        }

        if (asset.assetType?.valueOf() === StringAssetType.ERC721) {
          return [
            [erc721?.interface.getFunction('ownerOf') as FunctionFragment],
            asset.assetAddress,
            'ownerOf',
            [asset.assetId],
          ];
        }

        if (asset.assetType?.valueOf() === StringAssetType.ERC1155) {
          return [
            [erc1155?.interface.getFunction('balanceOf') as FunctionFragment],
            asset.assetAddress,
            'balanceOf',
            [account, asset.assetId],
          ];
        }

        return undefined;
      })
      .filter((x) => !!x);

    const results = await tryMultiCallCore(multi, inputs, false);

    if (!results) {
      setBalances([]);
      return;
    }

    const bs = results.map((result, i) => {
      if (assets[i]?.assetType?.valueOf() === StringAssetType.ERC721) {
        //console.log('yolllo', results[i]);
        return result?.[0] === account
          ? BigNumber.from('1')
          : result?.[0]
            ? BigNumber.from('0')
            : undefined;
      }
      return result?.[0] as BigNumber;
    });

    setBalances(bs);
  }, [chainId, multi, account, JSON.stringify(assets)]);

  useEffect(() => {
    if (chainId && multi && account && assets) {
      fetchBalances();
    }
  }, [chainId, multi, account, JSON.stringify(assets)]);

  return balances;
};


export const getAssetBalance = async (asset: NewAsset, library: Web3Provider, account: string): Promise<BigNumber> => {
  const lowerAccount = account.toLowerCase()
  if (asset.assetType === StringAssetType.NATIVE) {
    return await library.getBalance(lowerAccount)

  } else if (asset.assetType === StringAssetType.ERC20) {
    const contract = new Contract(asset.assetAddress, ERC20_ABI, library)
    return await contract.balanceOf(lowerAccount) as BigNumber


  } else if (asset.assetType === StringAssetType.ERC721) {
    const contract = new Contract(asset.assetAddress, ERC721_ABI, library)
    const owningAccount = await contract.ownerOf(asset.assetId)
    return (!!lowerAccount && (owningAccount?.toLowerCase() === lowerAccount)) ? BigNumber.from('1') : BigNumber.from('0')


  } else if (asset.assetType === StringAssetType.ERC1155) {
    const contract = new Contract(asset.assetAddress, ERC1155_ABI, library)
    return await contract.balanceOf(lowerAccount, asset.assetId) as BigNumber


  } else {
    throw new Error(`Unrecognized asset type ${asset.assetType.valueOf()}`)
  }
}


export const useNativeBalance = () => {
  const { chainId, account, library } = useActiveWeb3React();
  const [balance, setBalance] = useState<BigNumber | undefined>(undefined);
  const blocknumber = useBlockNumber();

  const fetchBalance = useCallback(async () => {
    if (account && library) {
      const b = await library?.getBalance(account);
      setBalance(b);
    }
  }, [chainId, library, account, blocknumber]);

  useEffect(() => {
    if (chainId && account && library) {
      fetchBalance();
    }
  }, [chainId, account, library, blocknumber]);

  return balance;
};
