import React, { useEffect, useRef, useState } from 'react';
import { AuthLayout, Loader } from 'ui';

import { theme } from 'theme/Theme';
import LoadingButton from '@mui/lab/LoadingButton';
import { ReCAPTCHA } from 'components/Recaptcha';
import { useNavigate } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import { Button, Input, Stack } from '@chakra-ui/react';

const EmailLoginPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [dirtyTextField, setDirtyTextField] = useState(false);
  const [failureMessage, setFailureMessage] = useState("")

  const recaptchaEl = useRef<any>(null)

  const isValidEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email)
  }

  const submitEmail = async (ema: string) => {
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
      setFailureMessage("Invalid captcha")
    }

    setImmediate(() => {
      recaptchaEl.current.reset()
    })


    try {
      const result = await axios({
        method: 'post',
        url: `${process.env.REACT_APP_BACKEND_API_URL}/auth/email/login`,
        headers: {
          "Content-Type": "application/json"
        },
        data: { email: ema, "g-recaptcha-response": token }
      });
      navigate('/account/login/email/verify')
      return
    } catch (e) {
      const err = e as AxiosError;

      if (!!err.response?.data?.message) {
        setFailureMessage(`Error: ${String(err.response?.data?.message)}`)
      } else {
        setFailureMessage(String(e))
      }
    }


    setDirtyTextField(false)
    setEmail("")
    setIsLoading(false)
  }

  const handleAlertClose = () => {
    setFailureMessage("")
  }

  const loginControls = () => {
    return <Stack alignItems="center" spacing={2}>
      {/*disabled={isLoading} inputProps={{ spellCheck: false, autoCapitalize: "off", autoCorrect: "off", onFocus: () => setDirtyTextField(true) }} value={email} error={dirtyTextField && !isValidEmail(email)} onKeyPress={(e) => {
        if (e.key === 'Enter' && !isLoading && isValidEmail(email)) {
          submitEmail(email)
        }
      }} onChange={(event) => { setEmail(event.target.value) }} label="EMAIL" variant="standard" */}
      <Input />
      <Button isLoading={isLoading} isDisabled={!isValidEmail(email)} onClick={() => submitEmail(email)} variant="solid">SEND LOGIN CODE</Button>
    </Stack >
  }

  let alert
  let alertClose: (() => void) | undefined = handleAlertClose
  if (!process.env.REACT_APP_RECAPTCHA_SITEKEY) {
    alert = { severity: "error", text: "No recaptcha sitekey defined. Please contact admins." }
    alertClose = undefined
  } else if (failureMessage) {
    alert = { severity: "error", text: failureMessage }
  }

  return (
    <>
      <AuthLayout title="EMAIL LOGIN" loading={false} alert={alert} handleAlertClose={alertClose}> {loginControls()}
      </AuthLayout >
      {!!process.env.REACT_APP_RECAPTCHA_SITEKEY && <ReCAPTCHA ref={recaptchaEl} grecaptcha={window.grecaptcha} sitekey={process.env.REACT_APP_RECAPTCHA_SITEKEY || ""} size="invisible" theme="dark" />}

    </>
  );

};

export default EmailLoginPage;
