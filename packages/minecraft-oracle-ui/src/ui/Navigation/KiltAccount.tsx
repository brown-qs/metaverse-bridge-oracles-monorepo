import Box from '@mui/material/Box';
import "@fontsource/orbitron/500.css";
import { useClasses } from 'hooks';
import { getKilExtension, walletLogin } from 'utils/kilt';
import { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

export default function KiltAccount() {
  const [loading, setLoading] = useState<boolean>(false);
  const [loggedIn, setLoggedIn] = useState<boolean>(false);

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

    try {
      await walletLogin(kiltExtension)
    } catch (e) {
      setLoading(false)
      alert(e)
      return
    }

    setLoggedIn(true)
    setLoading(false)
  }



  if (loading) {
    return (
      <LoadingButton loading loadingPosition="end" variant="contained" onClick={() => handleLogin()}>KILT Login&nbsp;&nbsp;&nbsp;</LoadingButton>
    );
  } else if (loggedIn) {
    return (
      <LoadingButton variant="contained" onClick={() => handleLogin()}>KILT Logout</LoadingButton>

    );
  } else {
    return (
      <LoadingButton variant="contained" onClick={() => handleLogin()}>KILT Login</LoadingButton>
    );
  }

};
