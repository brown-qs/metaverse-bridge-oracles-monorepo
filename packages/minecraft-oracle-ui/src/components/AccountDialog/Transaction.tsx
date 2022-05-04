import { CircularProgress, Stack } from '@mui/material';
import Typography from '@mui/material/Typography';
import { ExternalLink } from 'components';
import { ChainId } from '../../constants';
import { useActiveWeb3React } from 'hooks';
import { useAllTransactions } from 'state/transactions/hooks';
import { getExplorerLink } from 'utils';
import { useClasses } from 'hooks';
import { styles as transactionStyles} from './Transaction.styles';
import { CheckCircle, Triangle } from 'react-feather';

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
    <div>
      <ExternalLink
        href={getExplorerLink(
          chainId ?? ChainId.MOONRIVER,
          hash,
          'transaction'
        )}
      >
        <Stack direction={'row'} spacing={1}>
          <div className={`${pending ? styles.iconWrapperText: success ? styles.iconWrapperSuccess : styles.iconWrapperError}`}>
            {pending ? (
              <CircularProgress />
            ) : success ? (
              <CheckCircle size="16" />
            ) : (
              <Triangle size="16" />
            )}
          </div>
        <Typography variant={'body2'}>{summary ?? hash} ↗</Typography>
        </Stack>
      </ExternalLink>
    </div>
  );
};
