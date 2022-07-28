import React, { useEffect, useState } from 'react';
import { AuthLayout, Loader } from 'ui';
import { useAuth, useClasses } from 'hooks';

import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Button, FormControl, FormErrorMessage, FormHelperText, FormLabel, Input, Link, Stack } from '@chakra-ui/react';

const EmailVerifyPage = () => {
  const { authData, setAuthData } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [loginKey, setLoginKey] = useState("");
  const [dirtyTextField, setDirtyTextField] = useState(false);
  const [failureMessage, setFailureMessage] = useState("")

  const verifyLoginKey = async (loginKey: string) => {
    setIsLoading(true)
    try {
      const response = await axios({
        method: 'get',
        url: `${process.env.REACT_APP_BACKEND_API_URL}/auth/email/verify?loginKey=${loginKey}`,
        headers: {
          'Content-Type': 'application/json'
        },
        validateStatus: () => true
      });
      if (response?.data?.success) {
        const jwt = response.data.jwt
        navigate(`/auth/${jwt}`)
      } else {
        const msg = response?.data?.message
        if (msg) {
          setDirtyTextField(false)
          setLoginKey("")
          setIsLoading(false)
          setFailureMessage(`Failed to log you in: ${msg}. Please try again.`)
        } else {
          setDirtyTextField(false)
          setLoginKey("")
          setIsLoading(false)
          setFailureMessage("Failed to log you in. Please try again.")
        }
      }
    } catch (e) {
      setDirtyTextField(false)
      setLoginKey("")
      setIsLoading(false)
      setFailureMessage(`Failed to log you in: ${e}. Please try again.`)
    }
  }

  const isValidLoginKey = (loginKey: string) => {
    return /^[a-z0-9]{40}$/.test(loginKey)
  }

  const handleAlertClose = () => {
    setFailureMessage("")
  }
  /*
    const verifyControls = () => {
      return <Stack alignItems="center" spacing={1}>
        <TextField disabled={isLoading} inputProps={{ spellCheck: false, autoCapitalize: "off", autoCorrect: "off", onFocus: () => setDirtyTextField(true) }} value={loginKey} error={dirtyTextField && !isValidLoginKey(loginKey)} onKeyPress={(e) => {
          if (e.key === 'Enter' && !isLoading && isValidLoginKey(loginKey)) {
            verifyLoginKey(loginKey)
          }
        }} onChange={(event) => { setLoginKey(event.target.value) }} label="LOGIN CODE" variant="standard" />
        <div></div>
        <LoadingButton disableElevation disableRipple loading={isLoading} disabled={!isValidLoginKey(loginKey)} onClick={(e) => verifyLoginKey(loginKey)} variant="contained">USE LOGIN CODE</LoadingButton>
        {!!authData?.jwt
          ?
          <Link sx={{ fontSize: "11px" }} underline="none" onClick={() => { navigate(`/account`) }}>GO BACK</Link>
          :
          <Link sx={{ fontSize: "11px" }} underline="none" onClick={() => { navigate(`/account/login/email`) }}>REQUEST A NEW CODE</Link>
        }
      </Stack >
    }*/


  let alert
  if (failureMessage) {
    alert = { severity: "error", text: failureMessage }
  }

  return (
    <AuthLayout title="LOGIN CODE" loading={false} alert={alert} handleAlertClose={handleAlertClose}>
      <Stack alignItems="center" spacing={2}>
        <FormControl isInvalid={dirtyTextField && !isValidLoginKey(loginKey)} maxW="300px">
          <FormLabel>Login Code</FormLabel>
          <Input
            isDisabled={isLoading}
            value={loginKey}
            onChange={(e) => {
              setLoginKey(e.target.value)
            }}
            onFocus={() => setDirtyTextField(true)}
            onKeyUp={(e) => {
              if (e.key === 'Enter' && !isLoading && isValidLoginKey(loginKey)) {
                verifyLoginKey(loginKey)
              }
            }}
            spellCheck="false"
            autoCapitalize="off"
            autoCorrect="off"
          />
          {dirtyTextField && !isValidLoginKey(loginKey) ? (
            <FormErrorMessage sx={{}}>Invalid login code.</FormErrorMessage>

          ) : (
            <FormHelperText>
              &nbsp;
            </FormHelperText>
          )}
        </FormControl>
        <Button isLoading={isLoading} isDisabled={!isValidLoginKey(loginKey)} onClick={() => verifyLoginKey(loginKey)} variant="solid">SEND LOGIN CODE</Button>
        {!!authData?.jwt
          ?
          <Link sx={{ fontSize: "11px" }} onClick={() => { navigate(`/account`) }}>GO BACK</Link>
          :
          <Link sx={{ fontSize: "11px" }} onClick={() => { navigate(`/account/login/email`) }}>REQUEST A NEW CODE</Link>
        }
      </Stack >
    </AuthLayout >
  );
};

export default EmailVerifyPage;
