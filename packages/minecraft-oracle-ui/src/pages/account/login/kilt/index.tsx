import React, { useState } from 'react';
import { AuthLayout, Loader } from 'ui';
import { useClasses } from 'hooks';
import Tooltip from '@mui/material/Tooltip';

import WhiteLogo from 'assets/images/moonsama-glitch-white.svg';
import LeftImage from 'assets/images/home/left.png';
import RightImageFlip from 'assets/images/home/right.png';
import Box from '@mui/material/Box';
import "@fontsource/orbitron/500.css";
import { Button, Stack, Typography, useMediaQuery } from '@mui/material';
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
      <Stack alignItems="center">
        <LoadingButton disableElevation disableRipple loading={isLoading} variant="contained" onClick={() => handleLogin()}>KILT LOGIN</LoadingButton>
      </Stack>
    </AuthLayout >
  );
};

export default KiltLoginPage;
