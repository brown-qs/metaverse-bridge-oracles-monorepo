import { useDispatch, useSelector } from "react-redux";
import { Checks, Wallet } from "tabler-icons-react";
import { ReduxModal } from ".";
import { closeInGameItemModal, selectInGameItemModalOpen } from "../../state/slices/inGameItemModalSlice";
import { FormControl, Input, Button, useDisclosure, FormErrorMessage, FormHelperText, useToast, ToastId, VStack, Image, Box } from "@chakra-ui/react"
import { fetchBaseQuery, FetchBaseQueryError } from "@reduxjs/toolkit/query"
import { ReactNode, useEffect, useMemo, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Mail, MailForward } from "tabler-icons-react"
import { useCaptcha } from "../../hooks/useCaptcha/useCaptcha"
import { rtkQueryErrorFormatter, useEmailLoginCodeMutation } from "../../state/api/bridgeApi"
import { closeEmailLoginModal, selectEmailLoginModalOpen } from "../../state/slices/emailLoginModalSlice";
import { closeKiltLoginModal, selectKiltLoginModalOpen } from "../../state/slices/kiltLoginModalSlice";
import { setTokens } from "../../state/slices/authSlice";
import { getKiltExtension, walletLogin } from "../../utils/kilt";
import KiltLogo from "../../assets/images/kiltlogo.svg"


export function KiltLoginModal() {
    const isOpen = useSelector(selectKiltLoginModalOpen)

    const [isLoading, setIsLoading] = useState(false)
    const [statusMessage, setStatusMessage] = useState("")
    const [failureMessage, setFailureMessage] = useState("")
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const toast = useToast()
    const toastIdRef = useRef<ToastId>()


    const closeLastToast = () => {
        if (toastIdRef.current) {
            toast.close(toastIdRef.current)
        }
    }

    useEffect(() => {
        closeLastToast()
        setIsLoading(false)
        setFailureMessage("")
    }, [isOpen])

    useEffect(() => {
        if (failureMessage && isOpen) {
            closeLastToast()
            toastIdRef.current = toast({
                title: 'Failure',
                description: failureMessage,
                status: 'error',
                duration: 5000,
                isClosable: true,
            })
        }
    }, [failureMessage, isOpen])

    const handleLogin = async () => {
        if (isLoading) {
            return
        }
        setFailureMessage("")
        setIsLoading(true)
        setStatusMessage("Looking for KILT wallet")
        let kiltExtension
        try {
            kiltExtension = await getKiltExtension()
        } catch (e) {
            setFailureMessage("No KILT wallet!")
            setIsLoading(false)
            return
        }

        let result: any
        try {
            result = await walletLogin(kiltExtension)
        } catch (e) {
            setFailureMessage(String(e))
            setIsLoading(false)
            return
        }
        if (!!result?.jwt) {

            closeLastToast()
            toast({
                title: 'Success!',
                description: "You are now logged in.",
                status: 'success',
                duration: 5000,
                isClosable: true,
            })
            dispatch(setTokens({ accessToken: result?.jwt, refreshToken: null }));

        } else if (!!result?.message) {
            setFailureMessage(`${result.message}`)
        } else {
            setFailureMessage("Unable to get auth token")
        }
        setIsLoading(false)
    }

    return (<><ReduxModal
        isOpenSelector={selectKiltLoginModalOpen}
        closeActionCreator={closeKiltLoginModal}
    >
        <VStack spacing="0">
            <Box w="100%" h="24px" minHeight="24px" >
                <Image h="24px" src={KiltLogo}></Image>
            </Box>
            <Box paddingTop="16px" fontSize="14px" color="whiteAlpha.700" lineHeight="21px">
                Logging in with KILT requires a Sporran desktop wallet. Your wallet must include a SocialKYC email credential. Your Moonsama account is based on your email.
            </Box>
            <Box w="100%">
                <Button isLoading={isLoading} isDisabled={isLoading} marginTop="16px" w="100%" leftIcon={<Wallet></Wallet>} onClick={() => { handleLogin() }}>CONNECT SPORRAN WALLET</Button>

            </Box>
        </VStack>



    </ReduxModal>
    </>
    )
}