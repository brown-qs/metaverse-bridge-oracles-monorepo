
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

export const Transaction = ({ hash }: { hash: string }) => {
  const { chainId } = useActiveWeb3React();
  const allTransactions = useAllTransactions();

  const tx = allTransactions?.[hash];
  const summary = tx?.summary;
  const pending = !tx?.receipt;
  const success =
    !pending &&
    tx &&
    (tx.receipt?.status === 1 || typeof tx.receipt?.status === 'undefined');

  const styles = useClasses(transactionStyles);

  return (
    <TransactionLink
      href={getExplorerLink(
        chainId ?? ChainId.MOONRIVER,
        hash,
        'transaction'
      )}
      linkText={summary ?? hash}
    />

  );
};
