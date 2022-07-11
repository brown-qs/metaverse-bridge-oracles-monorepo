import React, { useState } from 'react';
import { AuthLayout, Loader } from 'ui';
import { useClasses } from 'hooks';
import Tooltip from '@mui/material/Tooltip';

import WhiteLogo from 'assets/images/moonsama-glitch-white.svg';
import LeftImage from 'assets/images/home/left.png';
import RightImageFlip from 'assets/images/home/right.png';
import Box from '@mui/material/Box';
import "@fontsource/orbitron/500.css";
import { Alert, Button, Stack, Typography, useMediaQuery, Link } from '@mui/material';
import { theme } from 'theme/Theme';
import { getKiltExtension, walletLogin } from 'utils/kilt';
import { useHistory } from 'react-router-dom';
import LoadingButton from '@mui/lab/LoadingButton';

const KiltLoginPage = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [statusMessage, setStatusMessage] = useState("")
  const [failureMessage, setFailureMessage] = useState("")
  let history = useHistory();



  const handleLogin = async () => {
    if (isLoading) {
      return
    }
    setIsLoading(true)
    setStatusMessage("Looking for KILT wallet")
    let kiltExtension
    try {
      kiltExtension = await getKiltExtension()
    } catch (e) {
      setFailureMessage("Failed: No KILT wallet!")
      setIsLoading(false)
      return
    }

    let result: any
    try {
      result = await walletLogin(kiltExtension)
    } catch (e) {
      setFailureMessage(String(e))
      setIsLoading(false)
      return
    }
    if (!!result?.jwt) {
      history.push(`/auth/${result.jwt}`)
    } else if (!!result?.message) {
      setFailureMessage(`Failed: ${result.message}`)
    } else {
      setFailureMessage("Failed: Unable to get auth token")
    }
    setIsLoading(false)
  }

  const handleAlertClose = () => {
    setFailureMessage("")
    setIsLoading(false)
  }

  let alert
  if (failureMessage) {
    alert = { severity: "error", text: failureMessage }
  }
  return (
    <AuthLayout title="KILT LOGIN" loading={false} alert={alert} handleAlertClose={handleAlertClose}>

      <Stack direction="row" spacing={2} margin={0} alignContent='center' textAlign='center' justifyContent="space-between">
        <Stack></Stack>
        <Alert sx={{ margin: "auto" }} severity="info">Logging in with KILT requires a Sporran desktop wallet. Your wallet must include a SocialKYC email credential from <Link sx={{ textDecoration: "underline !important", "&:hover": { "color": "rgb(255, 201, 20) !important" } }} underline="always" href="https://socialkyc.io" target="_blank">socialkyc.io</Link>. Your Moonsama account is based on your email</Alert>
        <Stack></Stack>
      </Stack>
      <Stack alignItems="center" spacing={1} margin={2}>

        <LoadingButton disableElevation disableRipple loading={isLoading} variant="contained" onClick={() => handleLogin()}>KILT LOGIN</LoadingButton>
        <Link sx={{ fontSize: "11px" }} underline="none" onClick={() => { history.push(`/account/login`) }}>OTHER LOGIN METHODS</Link>
      </Stack>
    </AuthLayout >
  );
};

export default KiltLoginPage;
