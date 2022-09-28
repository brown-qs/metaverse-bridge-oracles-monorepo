import { useDispatch, useSelector } from "react-redux";
import { Checks } from "tabler-icons-react";
import { ReduxModal } from ".";
import { closeInGameItemModal, selectInGameItem, selectInGameItemModalOpen } from "../../state/slices/inGameItemModalSlice";
import { FormControl, Input, Button, useDisclosure, FormErrorMessage, FormHelperText, useToast, ToastId } from "@chakra-ui/react"
import { fetchBaseQuery, FetchBaseQueryError } from "@reduxjs/toolkit/query"
import { ReactNode, useEffect, useMemo, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Mail, MailForward } from "tabler-icons-react"
import { useCaptcha } from "../../hooks/useCaptcha/useCaptcha"
import { rtkQueryErrorFormatter, useEmailLoginCodeMutation } from "../../state/api/bridgeApi"
import { closeEmailLoginModal, selectEmailLoginModalOpen } from "../../state/slices/emailLoginModalSlice";
import { openEmailCodeModal } from "../../state/slices/emailCodeModalSlice";


export function KiltLoginModal() {
    const isOpen = useSelector(selectEmailLoginModalOpen)
    const dispatch = useDispatch()

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
        setCaptchaVisible(isOpen)
        setSubmitTried(false)
        setEmail("")
        reset()
        setSomethingLoading(false)
    }, [isOpen])


    //CAPTCHA SUCCESS/FAIL
    useEffect(() => {
        if (isCaptchaError && isOpen) {
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

    }, [isCaptchaError, isOpen])

    useEffect(() => {
        if (captchaSolution && isOpen) {
            submitEmailLoginCode({ email, "g-recaptcha-response": captchaSolution })
        }
        resetCaptcha()
    }, [isCaptchaSolved, isOpen])


    //HTTP REQ SUCCESS/FAIL
    useEffect(() => {
        if (isError && isOpen) {
            setSomethingLoading(false)
            let err = String(error)
            closeLastToast()
            toastIdRef.current = toast({
                title: 'Failed to send login code.',
                description: rtkQueryErrorFormatter(error),
                status: 'error',
                duration: 5000,
                isClosable: true,
            })
            reset()
        }
    }, [isError, isOpen])

    useEffect(() => {
        if (isSuccess && isOpen) {

            setSomethingLoading(false)

            closeLastToast()

            toast({
                title: 'Login code sent.',
                description: "Please check your email.",
                status: 'success',
                duration: 5000,
                isClosable: true,
            })
            dispatch(openEmailCodeModal())
            dispatch(closeEmailLoginModal())
            reset()
        }
    }, [isSuccess, isOpen])

    //prevent small pause between captcha finish loading and request to bakcend starting

    const handleSubmit = (em: string) => {
        setSubmitTried(true)
        if (!isValidEmail(em)) {
            return
        }
        setSomethingLoading(true)
        executeCaptcha()
    }




    return (<><ReduxModal
        isOpenSelector={selectEmailLoginModalOpen}
        closeActionCreator={closeEmailLoginModal}
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

    </ReduxModal>
    </>
    )
}