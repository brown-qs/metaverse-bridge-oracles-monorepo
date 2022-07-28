import React, { useEffect, useState } from 'react';
import { AuthLayout, Loader } from 'ui';
import { useAuth, useClasses } from 'hooks';
import Tooltip from '@mui/material/Tooltip';
import CloseIcon from '@mui/icons-material/Close';

import WhiteLogo from 'assets/images/moonsama-glitch-white.svg';
import LeftImage from 'assets/images/home/left.png';
import RightImageFlip from 'assets/images/home/right.png';
import Box from '@mui/material/Box';

import { Link, Alert, Button, CircularProgress, Collapse, IconButton, Input, Stack, TextField, Typography, useMediaQuery } from '@mui/material';
import { theme } from 'theme/Theme';
import LoadingButton from '@mui/lab/LoadingButton';
import { Redirect, useHistory, useParams } from 'react-router-dom';
import axios from 'axios';

const EmailVerifyPage = () => {
  const { authData, setAuthData } = useAuth();
  let history = useHistory();
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
  }


  let alert
  if (failureMessage) {
    alert = { severity: "error", text: failureMessage }
  }

  return (
    <AuthLayout title="LOGIN CODE" loading={false} alert={alert} handleAlertClose={handleAlertClose}>{verifyControls()} </AuthLayout >
  );
};

export default EmailVerifyPage;
