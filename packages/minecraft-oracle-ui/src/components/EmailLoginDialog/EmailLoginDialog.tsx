import { FormControl, Input, Button, useDisclosure, FormErrorMessage, FormHelperText, useToast, ToastId } from "@chakra-ui/react"
import { fetchBaseQuery, FetchBaseQueryError } from "@reduxjs/toolkit/query"
import { ReactNode, useEffect, useMemo, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Mail, MailForward } from "tabler-icons-react"
import { useCaptcha } from "../../hooks/useCaptcha/useCaptcha"
import { useEmailCodeDialog } from "../../hooks/useEmailCodeDialog/useEmailCodeDialog"
import { useEmailLoginDialog } from "../../hooks/useEmailLoginDialog/useEmailLoginDialog"
import { bridgeApiErrorFormatter, useEmailLoginCodeMutation } from "../../state/api/bridgeApi"
import { MoonsamaModal } from "../MoonsamaModal"
import { ReCAPTCHA } from "../Recaptcha"

export const EmailLoginDialog: React.FC<{}> = ({ }) => {
    const { isEmailLoginDialogOpen, onEmailLoginDialogOpen, onEmailLoginDialogClose } = useEmailLoginDialog()
    const { isEmailCodeDialogOpen, onEmailCodeDialogOpen, onEmailCodeDialogClose } = useEmailCodeDialog()

    const [submitEmailLoginCode, { error, isUninitialized, isLoading, isSuccess, isError, reset }] = useEmailLoginCodeMutation()
    const { executeCaptcha, resetCaptcha, setCaptchaVisible, isCaptchaLoading, isCaptchaError, isCaptchaSolved, captchaError, captchaSolution } = useCaptcha()
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [submitTried, setSubmitTried] = useState(false);

    //need to do this because there is brief pause between when captcha finishes loading and request starts loading
    const [somethingLoading, setSomethingLoading] = useState(false);

    const toast = useToast()
    const toastIdRef = useRef<ToastId>()

    const isValidEmail = (email: string) => {
        return /\S+@\S+\.\S+/.test(email)
    }

    const closeLastToast = () => {
        if (toastIdRef.current) {
            toast.close(toastIdRef.current)
        }
    }

    useEffect(() => {
        closeLastToast()
        setCaptchaVisible(isEmailLoginDialogOpen)
        setSubmitTried(false)
        setEmail("")
        reset()
        setSomethingLoading(false)

    }, [isEmailLoginDialogOpen])


    //CAPTCHA SUCCESS/FAIL
    useEffect(() => {
        if (isCaptchaError && isEmailLoginDialogOpen) {
            setSomethingLoading(false)
            closeLastToast()
            toastIdRef.current = toast({
                title: 'Invalid captcha.',
                description: "Please submit again.",
                status: 'error',
                duration: 5000,
                isClosable: true,
            })
            resetCaptcha()
        }

    }, [isCaptchaError, isEmailLoginDialogOpen])

    useEffect(() => {
        if (captchaSolution && isEmailLoginDialogOpen) {
            submitEmailLoginCode({ email, "g-recaptcha-response": captchaSolution })
        }
        resetCaptcha()
    }, [isCaptchaSolved, isEmailLoginDialogOpen])


    //HTTP REQ SUCCESS/FAIL
    useEffect(() => {
        if (isError && isEmailLoginDialogOpen) {
            setSomethingLoading(false)
            let err = String(error)
            closeLastToast()
            toastIdRef.current = toast({
                title: 'Failed to send login code.',
                description: bridgeApiErrorFormatter(error),
                status: 'error',
                duration: 5000,
                isClosable: true,
            })
            reset()
        }
    }, [isError, isEmailLoginDialogOpen])

    useEffect(() => {
        if (isSuccess && isEmailLoginDialogOpen) {

            setSomethingLoading(false)

            closeLastToast()

            toast({
                title: 'Login code sent.',
                description: "Please check your email.",
                status: 'success',
                duration: 5000,
                isClosable: true,
            })
            onEmailCodeDialogOpen()
            onEmailLoginDialogClose()
            reset()
        }
    }, [isSuccess, isEmailLoginDialogOpen])

    //prevent small pause between captcha finish loading and request to bakcend starting

    const handleSubmit = (em: string) => {
        setSubmitTried(true)
        if (!isValidEmail(em)) {
            return
        }
        setSomethingLoading(true)
        executeCaptcha()
    }


    return (<><MoonsamaModal
        isOpen={isEmailLoginDialogOpen}
        onClose={onEmailLoginDialogClose}
        TitleTablerIcon={Mail}
        title="EMAIL"
        message="Log in with the code you will receive to the provided email address."
    >

        <FormControl isInvalid={submitTried && !isValidEmail(email)}>
            <Input
                placeholder="Email"
                isDisabled={somethingLoading}
                value={email}
                onChange={(e) => {
                    setEmail(e.target.value)
                }}
                onFocus={() => { }}
                onKeyUp={(e) => {
                    if (e.key === 'Enter' && !isLoading) {
                        handleSubmit(e.target.value)
                    }
                }}
                spellCheck="false"
                autoCapitalize="off"
                autoCorrect="off"
            />
            {(submitTried && !isValidEmail(email)) ?
                <FormErrorMessage>Email is invalid.</FormErrorMessage>
                :
                <></>
            }
        </FormControl>
        <Button isLoading={somethingLoading} isDisabled={somethingLoading || (submitTried && !isValidEmail(email))} marginTop="16px" leftIcon={<MailForward></MailForward>} w="100%" onClick={() => { handleSubmit(email) }}>SEND LOGIN CODE</Button>

    </MoonsamaModal>
    </>
    )
}