import { FormControl, Input, Button, useDisclosure, FormErrorMessage, FormHelperText, useToast, ToastId, Box } from "@chakra-ui/react"
import { fetchBaseQuery, FetchBaseQueryError } from "@reduxjs/toolkit/query"
import { ReactNode, useEffect, useMemo, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Checks, Mail, MailForward } from "tabler-icons-react"
import { useEmailCodeDialog } from "../../hooks/useEmailCodeDialog/useEmailCodeDialog"
import { rtkQueryErrorFormatter, useEmailLoginCodeVerifyMutation } from "../../state/api/bridgeApi"
import { MoonsamaModal } from "../MoonsamaModal"

export const EmailCodeDialog: React.FC<{}> = ({ }) => {
    const { isEmailCodeDialogOpen, onEmailCodeDialogOpen, onEmailCodeDialogClose } = useEmailCodeDialog()
    const [verifyEmailLoginCode, { error, isUninitialized, isLoading, isSuccess, isError, reset }] = useEmailLoginCodeVerifyMutation()
    const navigate = useNavigate();
    const [loginCode, setLoginCode] = useState("");
    const [submitTried, setSubmitTried] = useState(false);
    const toast = useToast()
    const toastIdRef = useRef<ToastId>()



    const closeLastToast = () => {
        if (toastIdRef.current) {
            toast.close(toastIdRef.current)
        }
    }

    useEffect(() => {
        closeLastToast()
        setSubmitTried(false)
        setLoginCode("")
        reset()
    }, [isEmailCodeDialogOpen])


    //HTTP REQ SUCCESS/FAIL
    useEffect(() => {
        if (isError && isEmailCodeDialogOpen) {
            closeLastToast()
            toastIdRef.current = toast({
                title: 'Failed to verify login code.',
                description: rtkQueryErrorFormatter(error),
                status: 'error',
                duration: 5000,
                isClosable: true,
            })
            reset()
        }
    }, [isError, isEmailCodeDialogOpen])

    useEffect(() => {
        if (isSuccess && isEmailCodeDialogOpen) {
            closeLastToast()
            toast({
                title: 'Success!',
                description: "You are now logged in.",
                status: 'success',
                duration: 5000,
                isClosable: true,
            })
            reset()
        }
    }, [isSuccess, isEmailCodeDialogOpen])

    const isValidLoginKey = (loginKey: string) => {
        return /^[a-z0-9]{40}$/.test(loginKey)
    }
    const handleSubmit = (code: string) => {
        setSubmitTried(true)
        if (!isValidLoginKey(code)) {
            return
        }
        verifyEmailLoginCode(code)
    }

    return (<><MoonsamaModal
        isOpen={isEmailCodeDialogOpen}
        onClose={onEmailCodeDialogClose}
        TitleTablerIcon={Mail}
        title="EMAIL"
        message="Input the one-time login code that you received."
    >

        <FormControl isInvalid={submitTried && !isValidLoginKey(loginCode)}>
            <Input
                placeholder="Login Code"
                isDisabled={isLoading}
                value={loginCode}
                onChange={(e) => {
                    setLoginCode(e.target.value)
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
                autoComplete="false"
            />
            {(submitTried && true) ?
                <FormErrorMessage>Login code is invalid.</FormErrorMessage>
                :
                <></>
            }
        </FormControl>
        <Button isLoading={isLoading} isDisabled={isLoading || (submitTried && !isValidLoginKey(loginCode))} marginTop="16px" leftIcon={<Checks />} w="100%" onClick={() => { handleSubmit(loginCode) }}>LOG IN</Button>

    </MoonsamaModal>
    </>
    )
}