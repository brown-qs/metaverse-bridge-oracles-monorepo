import React, { useEffect, useRef, useState } from 'react';
import { AuthLayout, Loader } from 'ui';
import { ReCAPTCHA } from 'components/Recaptcha';
import { useNavigate } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import { Button, FormControl, FormErrorMessage, FormHelperText, FormLabel, Input, Stack } from '@chakra-ui/react';
import { useEmailLoginCodeMutation } from '../../../../state/api/bridgeApi';

const EmailLoginPage = () => {
  const [submitEmailLoginCode, { error, isUninitialized, isLoading, isSuccess, isError, reset }] = useEmailLoginCodeMutation()
  const navigate = useNavigate();
  const [captchaIsLoading, setCaptchaIsLoading] = useState(false);
  const [captchaFailureMessage, setCaptchaFailureMessage] = useState("")
  const [email, setEmail] = useState("");
  const [dirtyTextField, setDirtyTextField] = useState(false);

  const recaptchaEl = useRef<any>(null)



  const isValidEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email)
  }

  const submitEmail = async (ema: string) => {
    setCaptchaIsLoading(true)
    let token
    try {
      if (recaptchaEl.current) {
        token = await recaptchaEl.current.executeAsync();
      }
    } catch (e) {
      setDirtyTextField(false)
      setEmail("")
      setCaptchaIsLoading(false)
      setCaptchaFailureMessage("Invalid captcha")
      window.setTimeout(() => {
        recaptchaEl.current.reset()
      }, 1)
      return
    }
    setCaptchaIsLoading(false)
    window.setTimeout(() => {
      recaptchaEl.current.reset()
    }, 1)

    submitEmailLoginCode({ email: ema, "g-recaptcha-response": token })
  }

  const handleAlertClose = () => {
    setCaptchaIsLoading(false)
    setCaptchaFailureMessage("")
    setDirtyTextField(false)
    setEmail("")
    reset()
  }


  let alert
  let alertClose: (() => void) | undefined = handleAlertClose
  if (!process.env.REACT_APP_RECAPTCHA_SITEKEY) {
    alert = { severity: "error", text: "No recaptcha sitekey defined. Please contact admins." }
    alertClose = undefined
  } else if (captchaFailureMessage) {
    alert = { severity: "error", text: captchaFailureMessage }
  } else if (isError) {
    alert = { severity: "error", text: String(error) }
  }

  if (isSuccess) {
    navigate("/acccount/login/email/verify")
    return <></>
  }

  return (
    <>
      <AuthLayout title="EMAIL LOGIN" loading={false} alert={alert} handleAlertClose={alertClose}>
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

export default EmailLoginPage;
