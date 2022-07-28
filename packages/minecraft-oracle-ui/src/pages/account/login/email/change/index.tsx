import React, { useRef, useState } from 'react';
import { AuthLayout } from 'ui';
import { useAuth } from 'hooks';


import { Link, useHistory } from 'react-router-dom'
import { ReCAPTCHA } from 'components/Recaptcha';
import axios, { AxiosError } from 'axios';
import { Button, FormControl, FormHelperText, FormLabel, Input, Stack } from '@chakra-ui/react';
const EmailChangePage = () => {
  const { authData, setAuthData } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [dirtyTextField, setDirtyTextField] = useState(false);
  const [failureMessage, setFailureMessage] = useState("")
  const history = useHistory();

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
        method: 'put',
        url: `${process.env.REACT_APP_BACKEND_API_URL}/auth/email/change`,
        headers: {
          "Authorization": `Bearer ${authData?.jwt}`,
          "Content-Type": "application/json"
        },
        data: { email: ema, "g-recaptcha-response": token }
      });
      //redirect
      navigate('/account/login/email/verify')

    } catch (e) {
      const err = e as AxiosError;

      if (err?.response?.data.statusCode === 401) {
        window.localStorage.removeItem('authData');
        setAuthData(undefined);
      };

      setFailureMessage(String(e))
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
      }} onChange={(event) => { setEmail(event.target.value) }}  */}
      <FormControl>
        <FormLabel>Email address</FormLabel>
        <Input type='email' />
        <FormHelperText>We'll never share your email.</FormHelperText>
        <Button variant="solid">CHANGE EMAIL</Button>
      </FormControl>
      {/*loading={isLoading} disabled={!isValidEmail(email)} onClick={(e) => submitEmail(email)}*/}

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
      <AuthLayout title="CHANGE EMAIL" loading={false} alert={alert} handleAlertClose={alertClose}> {loginControls()}
      </AuthLayout >
      {!!process.env.REACT_APP_RECAPTCHA_SITEKEY && <ReCAPTCHA ref={recaptchaEl} grecaptcha={window.grecaptcha} sitekey={process.env.REACT_APP_RECAPTCHA_SITEKEY || ""} size="invisible" theme="dark" />}
    </>
  );
};

export default EmailChangePage;
