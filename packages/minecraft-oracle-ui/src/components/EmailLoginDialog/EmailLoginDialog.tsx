import { FormControl, Input, Button, useDisclosure, FormErrorMessage, FormHelperText, useToast, ToastId } from "@chakra-ui/react"
import { fetchBaseQuery, FetchBaseQueryError } from "@reduxjs/toolkit/query"
import { ReactNode, useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { MailForward } from "tabler-icons-react"
import { useCaptcha } from "../../hooks/useCaptcha/useCaptcha"
import { useEmailLoginDialog } from "../../hooks/useEmailLoginDialog/useEmailLoginDialog"
import { bridgeApiErrorFormatter, useEmailLoginCodeMutation } from "../../state/api/bridgeApi"
import { MoonsamaModal } from "../MoonsamaModal"
import { ReCAPTCHA } from "../Recaptcha"

export const EmailLoginDialog: React.FC<{}> = ({ }) => {
    const { isEmailLoginDialogOpen, onEmailLoginDialogOpen, onEmailLoginDialogClose } = useEmailLoginDialog()
    const [submitEmailLoginCode, { error, isUninitialized, isLoading, isSuccess, isError, reset }] = useEmailLoginCodeMutation()
    const { executeCaptcha, resetCaptcha, setCaptchaVisible, isCaptchaLoading, isCaptchaError, isCaptchaSolved, captchaError, captchaSolution } = useCaptcha()
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [submitTried, setSubmitTried] = useState(false);
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
    }, [isEmailLoginDialogOpen])


    //CAPTCHA SUCCESS/FAIL
    useEffect(() => {
        if (isCaptchaError && isEmailLoginDialogOpen) {
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
            closeLastToast()

            toast({
                title: 'Login code sent.',
                description: "Please check your email.",
                status: 'success',
                duration: 5000,
                isClosable: true,
            })
            reset()
        }
    }, [isSuccess, isEmailLoginDialogOpen])

    const handleSubmit = (em: string) => {
        console.log("handleSubmit()")

        setSubmitTried(true)
        if (!isValidEmail(em)) {
            return
        }
        executeCaptcha()
    }


    return (<><MoonsamaModal
        isOpen={isEmailLoginDialogOpen}
        onClose={onEmailLoginDialogClose}
        title="Email"
    //message="Log in with the code you will receive to the provided email address."
    >

        <FormControl isInvalid={submitTried && !isValidEmail(email)}>
            <Input
                isDisabled={isCaptchaLoading || isLoading}
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
                <FormHelperText>We'll send you a one-time login code.</FormHelperText>
            }
        </FormControl>
        <Button isDisabled={isCaptchaLoading || isLoading || (submitTried && !isValidEmail(email))} marginTop="16px" leftIcon={<MailForward></MailForward>} w="100%" onClick={() => { handleSubmit(email) }}>LOG IN WITH EMAIL</Button>

    </MoonsamaModal>
    </>
    )
}