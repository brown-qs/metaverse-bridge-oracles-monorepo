import React, { useEffect, useRef, useState } from 'react';
import { AuthLayout, Loader } from 'ui';
import { useClasses } from 'hooks';
import Tooltip from '@mui/material/Tooltip';
import CloseIcon from '@mui/icons-material/Close';

import WhiteLogo from 'assets/images/moonsama-glitch-white.svg';
import LeftImage from 'assets/images/home/left.png';
import RightImageFlip from 'assets/images/home/right.png';
import Box from '@mui/material/Box';
import "@fontsource/orbitron/500.css";
import { Alert, Button, Collapse, IconButton, Input, Stack, TextField, Typography, useMediaQuery } from '@mui/material';
import { theme } from 'theme/Theme';
import LoadingButton from '@mui/lab/LoadingButton';
import { ReCAPTCHA } from 'components/Recaptcha';

const EmailLoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [dirtyTextField, setDirtyTextField] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false)
  const [failureMessage, setFailureMessage] = useState("")
  const recaptchaEl = useRef<any>(null)

  const isValidEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email)
  }

  const submitEmail = async (ema: string) => {
    setIsLoading(true)
    await new Promise((resolve) => { setTimeout(resolve, 1000) })
    let token
    try {
      if (recaptchaEl.current) {
        console.log("before captcha")
        token = await recaptchaEl.current.executeAsync();
      }
    } catch (e) {
      setDirtyTextField(false)
      setEmail("")
      setIsLoading(false)
      setFailureMessage("Invalid captcha")
    }

    setImmediate(() => {
      recaptchaEl.current.reset()
    })

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}/auth/email/login`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify({ email: ema, "g-recaptcha-response": token })
      })
      const json = await response.json()
      if (json.success) {
        setShowSuccess(true)
      } else {
        throw new Error(json?.error)
      }
      //success
    } catch (e) {
      setFailureMessage(String(e))
    }
    setDirtyTextField(false)
    setEmail("")
    setIsLoading(false)
  }

  const handleAlertClose = () => {
    setFailureMessage("")
    setShowSuccess(false)
  }

  const loginControls = () => {
    return <Stack alignItems="center" spacing={2}>
      <TextField disabled={isLoading} inputProps={{ spellCheck: false, autoCapitalize: "off", autoCorrect: "off", onFocus: () => setDirtyTextField(true) }} value={email} error={dirtyTextField && !isValidEmail(email)} onKeyPress={(e) => {
        if (e.key === 'Enter' && !isLoading && isValidEmail(email)) {
          submitEmail(email)
        }
      }} onChange={(event) => { setEmail(event.target.value) }} label="Email" variant="standard" />
      <LoadingButton disableElevation disableRipple loading={isLoading} disabled={!isValidEmail(email)} onClick={(e) => submitEmail(email)} variant="contained">Send Login Link</LoadingButton>
    </Stack >
  }

  let alert
  if (failureMessage) {
    alert = { severity: "error", text: failureMessage }
  } else if (showSuccess) {
    alert = { severity: "success", text: "A temporary login link has been emailed to you!" }

  }

  return (
    <>
      <AuthLayout title="Email Login" loading={false} alert={alert} handleAlertClose={handleAlertClose}> {loginControls()}
      </AuthLayout >
      <ReCAPTCHA ref={recaptchaEl} grecaptcha={window.grecaptcha} sitekey={process.env.REACT_APP_RECAPTCHA_SITEKEY || ""} size="invisible" theme="dark" />
    </>
  );

};

export default EmailLoginPage;
