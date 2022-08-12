export type CaptchaContextType = {
  executeCaptcha: () => void
  resetCaptcha: () => void
  setCaptchaVisible: React.Dispatch<React.SetStateAction<boolean>>
  isCaptchaLoading: boolean
  isCaptchaError: boolean
  isCaptchaSolved: boolean
  captchaError: string | undefined
  captchaSolution: string | undefined
};
