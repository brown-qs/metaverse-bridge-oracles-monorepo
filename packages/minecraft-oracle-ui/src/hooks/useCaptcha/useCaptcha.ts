import { useContext } from 'react';
import { CaptchaContext } from '../../context/captcha/captchaContext/captchaContext';

export const useCaptcha = () => {
  const context = useContext(CaptchaContext);

  if (context === undefined) {
    throw new Error(
      'useCaptcha must be used within a CaptchaContextController'
    );
  }
  return context;
};
