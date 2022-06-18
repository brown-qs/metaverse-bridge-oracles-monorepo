import React, { useEffect, useRef, useState } from 'react';
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
import { ReCAPTCHA } from 'components/Recaptcha';

const EmailLoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("asfdadf@asdf.com");
  const [dirtyTextField, setDirtyTextField] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false)
  const [failureReason, setFailureReason] = useState("")
  const [showFailure, setShowFailure] = useState(false)
  const recaptchaEl = useRef<any>(null)







  //called once
  const submitEmail = async (ema: string) => {
    console.log("email: " + email)
    setIsLoading(true)

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
      setFailureReason("Invalid captcha")
      setShowFailure(true)
    }

    setImmediate(() => {
      recaptchaEl.current.reset()

    })
    let failed = false

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
      setFailureReason(String(e))
      failed = true
    }
    setDirtyTextField(false)
    setEmail("")
    setIsLoading(false)
    if (failed) {
      setShowFailure(true)
    }
    //async captcha
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
          submitEmail(email)
        }
      }} onChange={(event) => { setEmail(event.target.value) }} label="Email" variant="standard" />
      <LoadingButton loading={isLoading} disabled={!isValidEmail(email)} onClick={(e) => submitEmail(email)} disableRipple variant="contained">Send Login Link</LoadingButton></>)
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
      <ReCAPTCHA ref={recaptchaEl} grecaptcha={window.grecaptcha} sitekey={process.env.REACT_APP_RECAPTCHA_SITEKEY || ""} size="invisible" theme="dark" />
    </Stack >
  );

};

export default EmailLoginPage;
