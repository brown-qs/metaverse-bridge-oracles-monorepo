import Box from '@mui/material/Box';
import "@fontsource/orbitron/500.css";
import { useClasses } from 'hooks';
import { getKilExtension, walletLogin } from 'utils/kilt';
import { useEffect, useState } from 'react';

export default function KiltAccount() {
  const [loading, setLoading] = useState<boolean>(false);

  const errorState = false
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
        border: `1px solid ${errorState ? '#FFC914' : '#0EEBA8'}`,
      }
    }
  })

  //border: `1px solid ${errorState ? '#FFC914' : '#0EEBA8'}`,

  const {
    BoxStyle
  } = useClasses(styles)

  let internalLoading: boolean = false


  const handleLogin = async () => {
    if (loading) {
      return
    }
    setLoading(true)

    let kiltExtension
    try {
      kiltExtension = await getKilExtension()
    } catch (e) {
      setLoading(false)
      alert("No kilt wallet!")
      return
    }
    await walletLogin(kiltExtension)


    setLoading(false)
  }



  if (loading) {
    return (
      <Box className={BoxStyle}>
        Kilt Login Loading
      </Box>
    );
  } else {
    return (
      <Box className={BoxStyle} onClick={() => handleLogin()}>
        Kilt Login
      </Box>
    );
  }

};
