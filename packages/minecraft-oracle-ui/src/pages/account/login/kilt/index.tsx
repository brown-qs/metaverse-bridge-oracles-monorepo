import React, { useState } from 'react';
import { AuthLayout } from 'ui';
import { getKiltExtension, walletLogin } from 'utils/kilt';
import { useNavigate } from 'react-router-dom';
import { Alert, Button, Link, Stack } from '@chakra-ui/react';

const KiltLoginPage = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [statusMessage, setStatusMessage] = useState("")
  const [failureMessage, setFailureMessage] = useState("")
  let navigate = useNavigate();



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
      navigate(`/auth/${result.jwt}`)
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
        <Alert sx={{ margin: "auto" }} status="info">Logging in with KILT requires a Sporran desktop wallet. Your wallet must include a <Link sx={{ textDecoration: "underline !important", "&:hover": { "color": "rgb(255, 201, 20) !important" } }} href="https://socialkyc.io" target="_blank">SocialKYC</Link> email credential. Your Moonsama account is based on your email.</Alert>
        <Stack></Stack>
      </Stack>
      <Stack alignItems="center" spacing={1} margin={2}>

        {/*  disableElevation disableRipple loading={isLoading} variant="contained" onClick={() => handleLogin()}*/}
        <Button variant="solid">KILT LOGIN</Button>
        <Link sx={{ fontSize: "11px" }} onClick={() => { navigate(`/account/login`) }}>OTHER LOGIN METHODS</Link>
      </Stack>
    </AuthLayout >
  );
};

export default KiltLoginPage;
