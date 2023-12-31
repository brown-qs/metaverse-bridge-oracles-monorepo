
import { useActiveWeb3React } from 'hooks/useActiveWeb3React/useActiveWeb3React';
import { useMemo } from 'react';
import { useRawAssetsFromList } from 'hooks/useRawAssetsFromList/useRawAssetsFromList';

export interface OwnedTokens {
  id: string;
  ownedTokens: { id: string; contract: { id: string } }[];
}

export const useWhitelistedAddresses = () => {
  const { chainId } = useActiveWeb3React();

  const collections = useRawAssetsFromList();

  return useMemo(() => {
    return collections.map((x) => x.address.toLowerCase());
  }, [chainId]);
};
