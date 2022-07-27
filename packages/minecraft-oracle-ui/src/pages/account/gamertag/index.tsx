import React, { useRef, useState } from 'react';
import { AuthLayout, Loader } from 'ui';
import { useAuth, useClasses } from 'hooks';
import Tooltip from '@mui/material/Tooltip';

import WhiteLogo from 'assets/images/moonsama-glitch-white.svg';
import LeftImage from 'assets/images/home/left.png';
import RightImageFlip from 'assets/images/home/right.png';
import Box from '@mui/material/Box';
import "@fontsource/orbitron/500.css";
import { Button, Stack, TextField, Typography, useMediaQuery } from '@mui/material';
import { theme } from 'theme/Theme';
import { Link, useHistory } from 'react-router-dom'
import LoadingButton from '@mui/lab/LoadingButton';
import { ReCAPTCHA } from 'components/Recaptcha';
import axios, { AxiosError } from 'axios';
const GamerTagChangePage = () => {
  const { authData, setAuthData } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [gamerTag, setGamerTag] = useState("");
  const [dirtyTextField, setDirtyTextField] = useState(false);
  const [failureMessage, setFailureMessage] = useState("")
  const history = useHistory();

  const recaptchaEl = useRef<any>(null)

  const isValidGamerTag = (email: string) => {
    return (typeof email === "string") && (email.length > 0)
  }

  const submitGamerTag = async (ema: string) => {
    setIsLoading(true)
    try {
      const result = await axios({
        method: 'put',
        url: `${process.env.REACT_APP_BACKEND_API_URL}/user/gamertag`,
        headers: {
          "Authorization": `Bearer ${authData?.jwt}`,
          "Content-Type": "application/json"
        },
        data: { gamerTag }
      });
      //redirect
      history.push('/account')

    } catch (e) {
      const err = e as AxiosError;

      if (err?.response?.data.statusCode === 401) {
        window.localStorage.removeItem('authData');
        setAuthData(undefined);
      } else if (!!err.response?.data?.message) {
        setFailureMessage(`Error: ${String(err.response?.data?.message)}`)
      } else {
        setFailureMessage(String(e))
      }
    }
    setDirtyTextField(false)
    setGamerTag("")
    setIsLoading(false)
  }

  const handleAlertClose = () => {
    setFailureMessage("")
  }

  const gamerTagControls = () => {
    return <Stack alignItems="center" spacing={2}>
      <TextField disabled={isLoading} inputProps={{ spellCheck: false, autoCapitalize: "off", autoCorrect: "off", onFocus: () => setDirtyTextField(true) }} value={gamerTag} error={dirtyTextField && !isValidGamerTag(gamerTag)} onKeyPress={(e) => {
        if (e.key === 'Enter' && !isLoading && isValidGamerTag(gamerTag)) {
          submitGamerTag(gamerTag)
        }
      }} onChange={(event) => { setGamerTag(event.target.value) }} label="GAMER TAG" variant="standard" />
      <LoadingButton disableRipple disableElevation loading={isLoading} disabled={!isValidGamerTag(gamerTag)} onClick={(e) => submitGamerTag(gamerTag)} variant="contained">SET GAMER TAG</LoadingButton>
    </Stack >
  }

  let alert
  let alertClose: (() => void) | undefined = handleAlertClose
  if (failureMessage) {
    alert = { severity: "error", text: failureMessage }
  }

  return (
    <>
      <AuthLayout title="SET GAMER TAG" loading={false} alert={alert} handleAlertClose={alertClose}> {gamerTagControls()}
      </AuthLayout >
    </>
  );
};

export default GamerTagChangePage;
