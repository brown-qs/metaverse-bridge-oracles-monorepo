import { request } from 'graphql-request';
import { useBlockNumber } from 'state/application/hooks';
import { SUBGRAPH_MAX_BLOCK_DELAY, SUBGRAPH_URL } from '../../constants';
import { QUERY_FILLS } from '../../subgraph/fillQueries';
import { Fill } from './types';
import { parseFill } from '../../utils/subgraph';
import { useState, useCallback, useEffect } from 'react';
import { useActiveWeb3React } from 'hooks';

export const useFills = () => {
  const { account } = useActiveWeb3React();
  const blockNumber = useBlockNumber();

  const [fills, setFills] = useState<Fill[] | undefined>();

  const fetchFills = useCallback(async () => {
    if (!account) {
      return;
    }
    /*
        const result = blockNumber
            ? await request(SUBGRAPH_URL, queryFillsAtBlock, {
                buyer: buyerAddress.toLowerCase(),
                block: { number: blockNumber },
            })
            : await request(SUBGRAPH_URL, queryFills, { buyer: buyerAddress.toLowerCase() });
        */

    const result = await request(SUBGRAPH_URL, QUERY_FILLS, {
      buyer: account.toLowerCase(),
    });

    console.debug('YOLO getFills', result);

    if (
      result?._meta?.block.number + SUBGRAPH_MAX_BLOCK_DELAY <
      (blockNumber ?? 0)
    ) {
      console.warn('Info fetched from subgraph might be stale');
    }

    const rawFills = result?.fills;
    if (!rawFills) {
      setFills([]);
      return;
    }
    const res = rawFills.map((x: any) => parseFill(x));
    setFills(res);
  }, [account, blockNumber]);

  useEffect(() => {
    fetchFills();
  }, [account, blockNumber]);

  return fills;
};
