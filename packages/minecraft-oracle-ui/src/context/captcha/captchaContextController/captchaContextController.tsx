import { Box } from '@chakra-ui/react';
import React, { useEffect, useRef, useState } from 'react';
import { ReCAPTCHA } from '../../../components/Recaptcha';
import { CaptchaContext } from '../captchaContext/captchaContext';
import { CaptchaContextControllerProps } from './captchaContextController.types';

export const CaptchaContextController = ({
  children,
}: CaptchaContextControllerProps) => {
  const [isCaptchaVisible, setCaptchaVisible] = useState<boolean>(false);
  const [isCaptchaLoading, setIsCaptchaLoading] = useState<boolean>(false);
  const [isCaptchaError, setIsCaptchaError] = useState<boolean>(false);
  const [isCaptchaSolved, setIsCaptchaSolved] = useState<boolean>(false);
  const [captchaError, setCaptchaError] = useState<string | undefined>(undefined);
  const [captchaSolution, setCaptchaSolution] = useState<string | undefined>(undefined);
  const recaptchaEl = useRef<any>(null)


  //on show or hide, reset state
  //initial state is set so don't have to worry about first mount
  useEffect(() => {
    if (!isCaptchaVisible) {
      resetCaptcha()
      window.setTimeout(() => {
        recaptchaEl.current.reset()
      }, 1)
    }
  }, [isCaptchaVisible])

  const resetCaptcha = () => {
    setIsCaptchaLoading(false)
    setIsCaptchaError(false)
    setIsCaptchaSolved(false)
    setCaptchaSolution(undefined)
    setCaptchaError(undefined)
  }

  //deal with sitekey not set
  //!process.env.REACT_APP_RECAPTCHA_SITEKEY
  const executeCaptcha = async () => {
    //no sitekey
    if (!process.env.REACT_APP_RECAPTCHA_SITEKEY) {
      setIsCaptchaLoading(false)
      setIsCaptchaError(true)
      setIsCaptchaSolved(false)
      setCaptchaSolution(undefined)
      setCaptchaError("No recaptcha sitekey defined. Please contact admins.")
      return
    }


    setCaptchaVisible(true)
    setIsCaptchaLoading(true)
    let token
    try {
      if (recaptchaEl.current) {
        token = await recaptchaEl.current.executeAsync();
      } else {
        setIsCaptchaLoading(false)
        setIsCaptchaError(true)
        setCaptchaError("Captcha needs to be set visible before using.")
        return
      }


      setIsCaptchaLoading(false)
      setIsCaptchaSolved(true)
      setCaptchaSolution(token)
      //reset so we're ready to execute again
      window.setTimeout(() => {
        recaptchaEl.current.reset()
      }, 1)
    } catch (e) {
      setIsCaptchaLoading(false)
      setIsCaptchaError(true)
      setCaptchaError("Captcha is invalid.")

      //reset so we're ready to execute again
      window.setTimeout(() => {
        recaptchaEl.current.reset()
      }, 1)
    }

  }
  return (
    <>
      {/* <Box>isCaptchaLoading: {String(isCaptchaLoading)} isCaptchaError: {String(isCaptchaError)} isCaptchaSolved: {String(isCaptchaSolved)} captchaError: {String(captchaError)} captchaSolution: {String(captchaSolution)}</Box>*/}
      <CaptchaContext.Provider
        value={{ executeCaptcha, resetCaptcha, setCaptchaVisible, isCaptchaVisible, isCaptchaLoading, isCaptchaError, isCaptchaSolved, captchaError, captchaSolution }}
      >
        {children}
      </CaptchaContext.Provider>
      {!!process.env.REACT_APP_RECAPTCHA_SITEKEY &&
        <Box visibility={isCaptchaVisible ? "visible" : "hidden"}>
          < ReCAPTCHA ref={recaptchaEl} grecaptcha={window.grecaptcha} sitekey={process.env.REACT_APP_RECAPTCHA_SITEKEY || ""} size="invisible" theme="dark" />
        </Box>
      }
    </>
  );
};
