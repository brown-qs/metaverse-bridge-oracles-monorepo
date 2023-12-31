import { Contract } from '@ethersproject/contracts';
import {
  ChainId,
  MARKETPLACE_V1_ADDRESS,
  MULTIVERSE_BRIDGE_V1_ADDRESS,
  MULTICALL_NETWORKS,
  RECOGNIZED_COLLECTIONS_ADDRESS,
  WAREHOUSE_ADDRESS,
  RPC_URLS,
  MULTIVERSE_BRIDGE_V2_ADDRESS,
} from '../../constants';
import { useCallback, useMemo } from 'react';
import { getContract, getContractWithChain } from 'utils';
import {
  MARKETPLACE_V1_ABI,
  METAVERSE_V1_ABI,
  METAVERSE_V2_ABI,
  RECOGNIZED_COLLECTIONS_ABI,
  WAREHOUSE_ABI,
} from '../../abi/marketplace';
import { MULTICALL2_ABI } from 'abi/multicall';
import { ERC1155_ABI, ERC20_ABI, ERC721_ABI } from 'abi/token';
import { useActiveWeb3React } from 'hooks';
import { MultiverseVersion } from '../../state/api/types';

export const useContract = (
  address: string | undefined,
  ABI: any,
  withSignerIfPossible = true
): Contract | null => {
  const { library, account } = useActiveWeb3React();

  return useMemo(() => {
    if (!address || !ABI || !library) return null;
    try {
      return getContract(
        address,
        ABI,
        library,
        withSignerIfPossible && account ? account : undefined
      );
    } catch (error) {
      console.error('Failed to get contract', error);
      return null;
    }
  }, [address, ABI, library, withSignerIfPossible, account]);
};

export const useContractWithChainCallback = (ABI: any, withSignerIfPossible = true) => {
  return useCallback(
    (address: string, chainId: number) => {
      if (!address || !ABI) return null;
      try {
        return getContractWithChain(
          address,
          ABI,
          RPC_URLS[chainId]
        );
      } catch (error) {
        console.error('Failed to get contract', error);
        return null;
      }
    },
    [ABI]
  );
};

export function useMultiverseBridgeV1Contract(
  withSignerIfPossible = true
): Contract | null {
  const { chainId } = useActiveWeb3React();
  return useContract(
    chainId
      ? MULTIVERSE_BRIDGE_V1_ADDRESS[(chainId as ChainId) ?? ChainId.MOONRIVER]
      : undefined,
    METAVERSE_V1_ABI,
    withSignerIfPossible
  );
}

export function useMultiverseBridgeContract(
  multiverseVersion: MultiverseVersion = MultiverseVersion.V1,
  withSignerIfPossible = true,
  chainId?: number
): Contract | null {
  let abi = METAVERSE_V1_ABI
  let contractAddress = chainId ? MULTIVERSE_BRIDGE_V1_ADDRESS[(chainId as ChainId) ?? ChainId.MOONRIVER] : undefined
  if (multiverseVersion === MultiverseVersion.V2) {
    abi = METAVERSE_V2_ABI
    contractAddress = chainId ? MULTIVERSE_BRIDGE_V2_ADDRESS[(chainId as ChainId) ?? ChainId.MOONRIVER] : undefined
  }

  return useContract(
    contractAddress,
    abi,
    withSignerIfPossible
  );
}


export function useMarketplaceV1Contract(
  withSignerIfPossible = true
): Contract | null {
  const { chainId } = useActiveWeb3React();
  return useContract(
    chainId
      ? MARKETPLACE_V1_ADDRESS[(chainId as ChainId) ?? ChainId.MOONRIVER]
      : undefined,
    MARKETPLACE_V1_ABI,
    withSignerIfPossible
  );
}

export function useRecognizedCollectionsContract(
  withSignerIfPossible = true
): Contract | null {
  const { chainId } = useActiveWeb3React();
  return useContract(
    chainId
      ? RECOGNIZED_COLLECTIONS_ADDRESS[
      (chainId as ChainId) ?? ChainId.MOONRIVER
      ]
      : undefined,
    RECOGNIZED_COLLECTIONS_ABI,
    withSignerIfPossible
  );
}

export function useWarehouseContract(): Contract | null {
  const { chainId } = useActiveWeb3React();
  return useContract(
    chainId
      ? WAREHOUSE_ADDRESS[(chainId as ChainId) ?? ChainId.MOONRIVER]
      : undefined,
    WAREHOUSE_ABI,
    false
  );
}

// this is a v2 version of the Multicall contract used in Uniswap/Makerdao
export function useMulticall2Contract(
  withSignerIfPossible = true
): Contract | null {
  const { chainId } = useActiveWeb3React();
  return useContract(
    chainId ? MULTICALL_NETWORKS[chainId ?? ChainId.MOONRIVER] : undefined,
    MULTICALL2_ABI,
    withSignerIfPossible
  );
}

export function useMulticall2ContractWithChain(
  withSignerIfPossible = true,
) {
  return useContractWithChainCallback(
    MULTICALL2_ABI,
    withSignerIfPossible
  );
}

export function useERC20Contract(
  address: string | undefined,
  withSignerIfPossible = true
): Contract | null {
  return useContract(address, ERC20_ABI, withSignerIfPossible);
}

export function useERC721Contract(
  address: string | undefined,
  withSignerIfPossible = true
): Contract | null {
  return useContract(address, ERC721_ABI, withSignerIfPossible);
}

export function useERC1155Contract(
  address: string | undefined,
  withSignerIfPossible = true
): Contract | null {
  return useContract(address, ERC1155_ABI, withSignerIfPossible);
}
