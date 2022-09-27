import { Box, Button, CircularProgress, FormControl, FormErrorMessage, HStack, Input, ToastId, useToast, VStack } from "@chakra-ui/react";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Checks, Mail } from "tabler-icons-react";
import { ReduxModal } from ".";
import { rtkQueryErrorFormatter, useEmailLoginCodeVerifyMutation } from "../../state/api/bridgeApi";
import { closeEmailCodeModal, selectEmailCodeModalOpen } from "../../state/slices/emailCodeModalSlice";
import { closeInGameItemModal, selectInGameItem, selectInGameItemModalOpen } from "../../state/slices/inGameItemModalSlice";

export function EmailCodeModal() {
    const isOpen = useSelector(selectEmailCodeModalOpen)
    const dispatch = useDispatch()
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
    }, [isOpen])


    //HTTP REQ SUCCESS/FAIL
    useEffect(() => {
        if (isError && isOpen) {
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
    }, [isError, isOpen])

    useEffect(() => {
        if (isSuccess && isOpen) {
            closeLastToast()
            toast({
                title: 'Success!',
                description: "You are now logged in.",
                status: 'success',
                duration: 5000,
                isClosable: true,
            })
            reset()
            dispatch(closeEmailCodeModal())
        }
    }, [isSuccess, isOpen])

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

    return (<><ReduxModal

        isOpenSelector={selectEmailCodeModalOpen}
        closeActionCreator={closeEmailCodeModal}
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

    </ReduxModal>
    </>
    )
}