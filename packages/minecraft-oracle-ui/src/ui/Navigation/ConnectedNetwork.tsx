import Box from '@mui/material/Box';
import "@fontsource/orbitron/500.css";
import { useWeb3React } from '@web3-react/core';
import { useAccountDialog, useActiveWeb3React, useClasses } from 'hooks';
import { NETWORK_NAME } from '../../constants';

export default function CarnageStatus() {
  const { chainId } = useActiveWeb3React();
  const { error: err } = useWeb3React();
  const { setAccountDialogOpen } = useAccountDialog();

  const showError = err ? true : false;
  const errorState = showError || !chainId

  const styles = () => ({
    BoxStyle: {
      backgroundColor: errorState ? 'rgba(255, 201, 20, 0.2)' : 'rgba(14, 235, 168, 0.2)',
      textTransform: 'uppercase',
      padding: '16px',
      fontFamily: 'Orbitron',
      fontSize: '12px',
      lineHeight: '16px',
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
    BoxStyle
  } = useClasses(styles)

  return (
    <Box onClick={() => setAccountDialogOpen(true)} className={BoxStyle}>
      {errorState ? 'Wrong Network' : NETWORK_NAME[chainId]}
    </Box>
  );
};
