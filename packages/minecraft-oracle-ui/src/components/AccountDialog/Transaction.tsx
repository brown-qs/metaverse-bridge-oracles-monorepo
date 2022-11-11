
import { ExternalLink } from 'components';
import { ChainId } from '../../constants';
import { useActiveWeb3React } from 'hooks';
import { useAllTransactions } from 'state/transactions/hooks';
import { getExplorerLink } from 'utils';
import { useClasses } from 'hooks';
import { styles as transactionStyles } from './Transaction.styles';
import { CheckCircle, Triangle } from 'react-feather';
import { CircularProgress, Stack, Text } from '@chakra-ui/react';
import { TransactionLink } from '../TransactionLink';
import { AllTransactionsType, TransactionType } from '../../state/slices/transactionsSlice';

export const Transaction = ({ transaction }: { transaction: AllTransactionsType }) => {

  if (transaction.type === TransactionType.Approval) {
    const summary = `APPROVE ${transaction.assetType} ${transaction.assetAddress}`
    return (
      <TransactionLink
        href={getExplorerLink(
          transaction.chainId,
          transaction.hash,
          'transaction'
        )}
        linkText={`${summary}`}
      />
    );
  } else if (transaction.type === TransactionType.In) {
    let ass = `ASSETS`
    if (transaction.assets.length === 1) {
      ass = 'ASSET'
    }
    const summary = `${transaction.assets.length} ${ass} ${transaction.migrate ? "MIGRATE" : "IN"} ${transaction.assets[0].assetType} ${transaction.assets[0].assetAddress}`
    return (
      <TransactionLink
        href={getExplorerLink(
          transaction.assets[0].chainId,
          transaction.hash,
          'transaction'
        )}
        linkText={`${summary}`}
      />
    );
  } else if (transaction.type === TransactionType.Out) {
    let ass = `ASSETS`
    if (transaction.bridgeHashes.length === 1) {
      ass = 'ASSET'
    }
    const summary = `${transaction.bridgeHashes.length} OUT`

    return (
      <TransactionLink
        href={getExplorerLink(
          transaction.chainId,
          transaction.hash,
          'transaction'
        )}
        linkText={`${summary}`}
      />
    );
  } else {
    return <></>
  }
};
