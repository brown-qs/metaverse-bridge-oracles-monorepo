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
      <LoadingButton disableRipple loading variant="contained" onClick={() => handleLogin()}>KILT Login</LoadingButton>
    );
  } else if (loggedIn) {
    return (
      <LoadingButton disableRipple variant="contained" onClick={() => handleLogin()}>KILT Logout</LoadingButton>

    );
  } else {
    return (

      <LoadingButton disableRipple variant="contained" onClick={() => handleLogin()}>KILT Login</LoadingButton>
    );
  }

};
