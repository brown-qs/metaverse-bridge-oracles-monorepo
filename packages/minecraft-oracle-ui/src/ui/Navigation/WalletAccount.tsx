

import { useAccountDialog, useActiveWeb3React } from 'hooks';
import { truncateAddress } from 'utils';
import { useClasses } from 'hooks';
import Identicon from 'components/Identicon/Identicon';
import { Box } from '@chakra-ui/react';
import { Wallet } from 'tabler-icons-react';

export default function WalletAccount() {
  const { account } = useActiveWeb3React();
  const { setAccountDialogOpen } = useAccountDialog();

  const styles = () => ({
    WalletDetailsStyle: {
      backgroundColor: 'rgba(14, 235, 168, 0.2)',
      textTransform: 'uppercase',
      padding: '12px 24px 12px 16px',
      whiteSpace: "nowrap",
      fontFamily: 'Orbitron',
      fontSize: '12px',
      lineHeight: '24px',
      letterSpacing: '0.032em',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      border: '1px solid transparent',
      cursor: 'pointer',
      borderRadius: '4px',
      '&:hover': {
        border: '1px solid #0EEBA8',
      }
    }
  })

  const {
    ConnectBoxStyle,
    WalletDetailsStyle,
  } = useClasses(styles)

  return (
    <>
      {
        account ? (
          <Box onClick={() => setAccountDialogOpen(true)} className={WalletDetailsStyle}>
            <div style={{ margin: '0 8px' }}>
              <Identicon />
            </div>
            <span>{truncateAddress(account, 4)}</span>
          </Box >
        ) : (
          <Box onClick={() => setAccountDialogOpen(true)} className={WalletDetailsStyle}>
            <Wallet />
            <span>Connect Wallet</span>
          </Box>
        )}
    </>
  );
}