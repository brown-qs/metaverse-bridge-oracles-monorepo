
import Box from '@mui/material/Box';
import "@fontsource/orbitron/500.css";
import { useAccountDialog, useActiveWeb3React } from 'hooks';
import { truncateAddress } from 'utils';
import { useClasses } from 'hooks';
import Identicon from 'components/Identicon/Identicon';

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
            <svg xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '8px' }} width="24" height="24" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#0EEBA8" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M17 8v-3a1 1 0 0 0 -1 -1h-10a2 2 0 0 0 0 4h12a1 1 0 0 1 1 1v3m0 4v3a1 1 0 0 1 -1 1h-12a2 2 0 0 1 -2 -2v-12" />
              <path d="M20 12v4h-4a2 2 0 0 1 0 -4h4" />
            </svg>
            <span>Connect Wallet</span>
          </Box>
        )}
    </>
  );
}