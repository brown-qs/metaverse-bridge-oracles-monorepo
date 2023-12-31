import { BigNumber } from '@ethersproject/bignumber';
import { TransactionResponse } from '@ethersproject/providers';
import { Asset } from 'hooks/marketplace/types';
import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { StringAssetType } from 'utils/subgraph';

import { useActiveWeb3React } from '../../hooks/useActiveWeb3React/useActiveWeb3React';
import { AppDispatch, AppState } from '../index';
import { addTransaction } from './actions';
import { TransactionDetails } from './reducer';

// helper that can take a ethers library transaction response and add it to the list of transactions
export function useTransactionAdder(): (
  response: TransactionResponse,
  customData?: {
    summary?: string;
    approval?: {
      tokenAddress: string;
      tokenType: StringAssetType;
      spender: string;
    };
    order?: {
      orderHash: string;
    };
    fill?: {
      orderHash: string;
    };
    cancel?: {
      orderHash: string;
    };
    transfer?: {
      asset: Asset;
      amount: BigNumber;
    };
    importResult?: {
      hash: string
    },
    exportResult?: {
      hash: string
    },
    enraptureResult?: {
      hash: string
    },
    claim?: { recipient: string };
  }
) => void {
  const { chainId, account } = useActiveWeb3React();
  const dispatch = useDispatch<AppDispatch>();

  return useCallback(
    (
      response: TransactionResponse,
      {
        summary,
        approval,
        order,
        fill,
        cancel,
        transfer,
        enraptureResult,
        importResult,
        exportResult
      }: {
        summary?: string;
        claim?: { recipient: string };
        approval?: {
          tokenAddress: string;
          spender: string;
          tokenType: StringAssetType;
        };
        order?: {
          orderHash: string;
        };
        fill?: {
          orderHash: string;
        };
        cancel?: {
          orderHash: string;
        };
        importResult?: {
          hash: string;
        };
        enraptureResult?: {
          hash: string;
        };
        exportResult?: {
          hash: string;
        };
        transfer?: {
          asset: Asset;
          amount: BigNumber;
        };
      } = {}
    ) => {
      if (!account) return;
      if (!chainId) return;

      const { hash } = response;
      if (!hash) {
        throw Error('No transaction hash found.');
      }
      dispatch(
        addTransaction({
          hash,
          from: account,
          chainId,
          approval,
          summary,
          order,
          fill,
          cancel,
          importResult,
          exportResult,
          enraptureResult,
          transfer
        })
      );
    },
    [dispatch, chainId, account]
  );
}

// returns all the transactions for the current chain
export function useAllTransactions(): { [txHash: string]: TransactionDetails } {
  const { chainId } = useActiveWeb3React();

  const state = useSelector<AppState, AppState['transactions']>(
    (state) => state.transactions
  );

  return chainId ? state[chainId] ?? {} : {};
}

export function useIsTransactionPending(transactionHash?: string): boolean {
  const transactions = useAllTransactions();

  if (!transactionHash || !transactions[transactionHash]) return false;

  return !transactions[transactionHash].receipt;
}

/**
 * Returns whether a transaction happened in the last day (86400 seconds * 1000 milliseconds / second)
 * @param tx to check for recency
 */
export function isTransactionRecent(tx: TransactionDetails): boolean {
  return new Date().getTime() - tx.addedTime < 86_400_000;
}

function newTransactionsFirst(a: TransactionDetails, b: TransactionDetails) {
  return b.addedTime - a.addedTime;
}

export function useSortedRecentTransactions() {
  let allTransactions = useAllTransactions();
  return useMemo(() => {
    const txs = Object.values(allTransactions);
    return txs.filter(isTransactionRecent).sort(newTransactionsFirst);
  }, [allTransactions]);
}

export function useSortedTransactions() {
  const allTransactions = useAllTransactions();

  return useMemo(() => {
    const txs = Object.values(allTransactions);
    return txs.sort(newTransactionsFirst);
  }, [allTransactions]);
}

// returns whether a token has a pending approval transaction
export function useHasPendingApproval(
  tokenAddress: string | undefined,
  spender: string | undefined,
  tokenType: StringAssetType | undefined
): boolean {
  const allTransactions = useAllTransactions();
  return useMemo(
    () =>
      typeof tokenAddress === 'string' &&
      typeof spender === 'string' &&
      tokenType !== undefined &&
      Object.keys(allTransactions).some((hash) => {
        const tx = allTransactions[hash];
        if (!tx) return false;
        if (tx.receipt) {
          return false;
        } else {
          const approval = tx.approval;
          if (!approval) return false;
          return (
            approval.spender === spender &&
            approval.tokenAddress === tokenAddress &&
            approval.tokenType.valueOf() === tokenType.valueOf() &&
            isTransactionRecent(tx)
          );
        }
      }),
    [allTransactions, spender, tokenAddress, tokenType]
  );
}

export function useSubmittedEnraptureTx(entryHash?: string): {
  enraptureSubmitted: boolean;
  enraptureTx: TransactionDetails | undefined;
} {
  const allTransactions = useAllTransactions();

  // get the txn if it has been submitted
  const enraptureTx = useMemo(() => {
    const txIndex = Object.keys(allTransactions).find((hash) => {
      const tx = allTransactions[hash];
      console.log(tx?.enraptureResult?.hash, entryHash, tx?.enraptureResult?.hash === entryHash)
      return tx.enraptureResult && entryHash && tx.enraptureResult.hash === entryHash;
    });
    return txIndex && allTransactions[txIndex]
      ? allTransactions[txIndex]
      : undefined;
  }, [allTransactions]);

  return { enraptureSubmitted: Boolean(enraptureTx), enraptureTx };
}

export function useSubmittedImportTx(entryHash?: string): {
  importSubmitted: boolean;
  importTx: TransactionDetails | undefined;
} {
  const allTransactions = useAllTransactions();

  // get the txn if it has been submitted
  const importTx = useMemo(() => {
    const txIndex = Object.keys(allTransactions).find((hash) => {
      const tx = allTransactions[hash];
      console.log(tx?.importResult?.hash, entryHash, tx?.importResult?.hash === entryHash)
      return tx.importResult && entryHash && tx.importResult.hash === entryHash;
    });
    return txIndex && allTransactions[txIndex]
      ? allTransactions[txIndex]
      : undefined;
  }, [allTransactions]);

  return { importSubmitted: Boolean(importTx), importTx };
}

export function useSubmittedExportTx(entryHash?: string): {
  exportSubmitted: boolean;
  exportTx: TransactionDetails | undefined;
} {
  const allTransactions = useAllTransactions();

  // get the txn if it has been submitted
  const exportTx = useMemo(() => {
    const txIndex = Object.keys(allTransactions).find((hash) => {
      const tx = allTransactions[hash];
      // console.log(tx?.exportResult?.hash, entryHash, tx?.exportResult?.hash === entryHash)
      return tx.exportResult && entryHash && tx.exportResult.hash === entryHash;
    });
    return txIndex && allTransactions[txIndex]
      ? allTransactions[txIndex]
      : undefined;
  }, [allTransactions]);

  return { exportSubmitted: Boolean(exportTx), exportTx };
}

export function useSubmittedTransferTx(
  asset?: Partial<Asset>,
  amount?: BigNumber
): {
  transferSubmitted: boolean;
  transferTx: TransactionDetails | undefined;
} {
  const allTransactions = useSortedRecentTransactions();

  // get the txn if it has been submitted
  const transferTx = useMemo(() => {
    if (!asset || !amount || !asset.assetAddress || !asset.assetType) {
      return undefined;
    }

    const tx = allTransactions.find((tx) => {
      return (
        tx.transfer &&
        tx.transfer.amount &&
        amount.eq(tx.transfer.amount) &&
        tx.transfer.asset &&
        tx.transfer.asset.assetAddress.toLowerCase() ===
        asset?.assetAddress?.toLowerCase() &&
        tx.transfer.asset.id === asset.id &&
        tx.transfer.asset.assetType.valueOf() === asset?.assetType?.valueOf()
      );
    });
    return tx ?? undefined;
  }, [allTransactions]);

  return { transferSubmitted: Boolean(transferTx), transferTx };
}
