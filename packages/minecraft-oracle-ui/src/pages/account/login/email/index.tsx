import React, { useEffect, useState } from 'react';
import { Loader } from 'ui';
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

const EmailLoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("adfafsd@asd.com");
  const [dirtyTextField, setDirtyTextField] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false)
  const [failureReason, setFailureReason] = useState("")
  const [showFailure, setShowFailure] = useState(false)

  const captchaSuccess = async (result: string) => {
    window.grecaptcha.reset()
    let failed = false
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}/auth/email/login`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify({ email: email, "g-recaptcha-response": result })
      })
      const json = await response.json()

      if (json.success) {
        setShowSuccess(true)
      } else {
        throw new Error(json?.error)
      }
      //success
    } catch (e) {
      setFailureReason(String(e))
      failed = true
    }
    setDirtyTextField(false)
    setEmail("")
    setIsLoading(false)
    if (failed) {
      setShowFailure(true)
    }
  }

  const captchaFailure = async (error: string) => {
    window.grecaptcha.reset()
    //handle captcha error
    setDirtyTextField(false)
    setEmail("")
    setIsLoading(false)
    setFailureReason("Invalid captcha")
    setShowFailure(true)
  }

  useEffect(() => {
    try {
      window.grecaptcha.render("#recaptcha", { "sitekey": process.env.REACT_APP_RECAPTCHA_SITEKEY, "theme": "light", size: "invisible", callback: (response) => { captchaSuccess(response) }, "expired-callback": () => { captchaFailure("expired") }, "error-callback": () => { captchaFailure("error") } }, false)
    } catch (e) {
      //if rendered more than once, will throw
    }

  }, [])
  //called once
  const kickOffCaptcha = () => {
    setIsLoading(true)
    window.grecaptcha.execute()
  }

  const isValidEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email)
  }

  const successAlert = () => {
    return (
      <Stack spacing={2} margin={2}>
        <Alert severity="success" onClose={() => { setShowSuccess(false) }}>A temporary login link has been emailed to you!</Alert>
      </Stack>
    );
  }

  const failureAlert = () => {
    return (
      <Stack spacing={2} margin={2}>
        <Alert severity="error" onClose={() => { setShowFailure(false) }}>Login failed: {failureReason} </Alert>
      </Stack>
    );
  }

  const loginControls = () => {
    return (<>
      <h1>Email Login</h1>

      <TextField disabled={isLoading} inputProps={{ spellCheck: false, autoCapitalize: "off", autoCorrect: "off", onFocus: () => setDirtyTextField(true) }} value={email} error={dirtyTextField && !isValidEmail(email)} onKeyPress={(e) => {
        if (e.key === 'Enter' && !isLoading && isValidEmail(email)) {
          kickOffCaptcha()
        }
      }} onChange={(event) => { setEmail(event.target.value) }} label="Email" variant="standard" />
      <LoadingButton loading={isLoading} disabled={!isValidEmail(email)} onClick={() => kickOffCaptcha()} disableRipple variant="contained">Send Login Link</LoadingButton></>)
  }

  return (
    <Stack direction="column" alignItems='center' textAlign='center' spacing={2}>
      {showSuccess
        ? successAlert()
        :
        showFailure
          ? failureAlert()
          : loginControls()
      }
      <div id="#recaptcha"></div>
    </Stack >
  );

};

export default EmailLoginPage;
