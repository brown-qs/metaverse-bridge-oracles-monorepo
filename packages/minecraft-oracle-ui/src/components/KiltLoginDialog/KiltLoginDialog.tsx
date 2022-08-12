import { FormControl, Input, Button, useDisclosure, Image, useToast, ToastId, VStack, Box } from "@chakra-ui/react"
import { ReactNode, useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { MailForward, Wallet } from "tabler-icons-react"
import { MoonsamaModal } from "../../components/MoonsamaModal"
import { useKiltLoginDialog } from "../../hooks/useKiltLoginDialog/useKiltLoginDialog"
import { useEmailLoginCodeVerifyMutation } from "../../state/api/bridgeApi"
import KiltLogo from "../../assets/images/kiltlogo.svg"
import { getKiltExtension, walletLogin } from "../../utils/kilt"
import { setTokens } from "../../state/slices/authSlice"
import { useDispatch } from "react-redux"
export const KiltLoginDialog: React.FC<{}> = ({ }) => {
    const { isKiltLoginDialogOpen, onKiltLoginDialogOpen, onKiltLoginDialogClose } = useKiltLoginDialog()
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
    }, [isKiltLoginDialogOpen])

    useEffect(() => {
        if (failureMessage && isKiltLoginDialogOpen) {
            closeLastToast()
            toastIdRef.current = toast({
                title: 'Failure',
                description: failureMessage,
                status: 'error',
                duration: 5000,
                isClosable: true,
            })
        }
    }, [failureMessage, isKiltLoginDialogOpen])

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
            window.localStorage.setItem('accessToken', result?.jwt);
            dispatch(setTokens({ accessToken: result?.jwt, refreshToken: null }));

        } else if (!!result?.message) {
            setFailureMessage(`${result.message}`)
        } else {
            setFailureMessage("Unable to get auth token")
        }
        setIsLoading(false)
    }

    return (<><MoonsamaModal
        isOpen={isKiltLoginDialogOpen}
        onClose={onKiltLoginDialogClose}
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



    </MoonsamaModal>
    </>
    )
}