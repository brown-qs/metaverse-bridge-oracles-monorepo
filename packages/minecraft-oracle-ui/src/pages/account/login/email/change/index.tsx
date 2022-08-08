import React, { useRef, useState } from 'react';
import { AuthLayout } from 'ui';
import { useAuth } from 'hooks';
import { useNavigate } from 'react-router-dom'
import { ReCAPTCHA } from 'components/Recaptcha';
import axios, { AxiosError } from 'axios';
import { Button, FormControl, FormErrorMessage, FormHelperText, FormLabel, Input, Stack } from '@chakra-ui/react';
const EmailChangePage = () => {
  const { authData, setAuthData } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [dirtyTextField, setDirtyTextField] = useState(false);
  const [failureMessage, setFailureMessage] = useState("")
  const navigate = useNavigate();

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

    window.setTimeout(() => {
      recaptchaEl.current.reset()
    }, 1)

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
      <AuthLayout title="CHANGE EMAIL" loading={false} alert={alert} handleAlertClose={alertClose}>
        <Stack alignItems="center" spacing={2}>
          <FormControl isInvalid={dirtyTextField && !isValidEmail(email)} maxW="300px">
            <FormLabel>Email</FormLabel>
            <Input
              isDisabled={isLoading}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
              }}
              onFocus={() => setDirtyTextField(true)}
              onKeyUp={(e) => {
                if (e.key === 'Enter' && !isLoading && isValidEmail(email)) {
                  submitEmail(email)
                }
              }}
              spellCheck="false"
              autoCapitalize="off"
              autoCorrect="off"
            />
            {dirtyTextField && !isValidEmail(email) ? (
              <FormErrorMessage sx={{}}>Invalid email.</FormErrorMessage>

            ) : (
              <FormHelperText>
                &nbsp;
              </FormHelperText>
            )}
          </FormControl>

          {/*disabled={isLoading} inputProps={{ spellCheck: false, autoCapitalize: "off", autoCorrect: "off", onFocus: () => setDirtyTextField(true) }} value={email} error={dirtyTextField && !isValidEmail(email)} onKeyPress={(e) => {
        if (e.key === 'Enter' && !isLoading && isValidEmail(email)) {
          submitEmail(email)
        }
      }} onChange={(event) => { setEmail(event.target.value) }} label="EMAIL" variant="standard" */}
          <Button isLoading={isLoading} isDisabled={!isValidEmail(email)} onClick={() => submitEmail(email)} >SEND LOGIN CODE</Button>
        </Stack >
      </AuthLayout >
      {!!process.env.REACT_APP_RECAPTCHA_SITEKEY && <ReCAPTCHA ref={recaptchaEl} grecaptcha={window.grecaptcha} sitekey={process.env.REACT_APP_RECAPTCHA_SITEKEY || ""} size="invisible" theme="dark" />}
    </>
  );
};

export default EmailChangePage;
