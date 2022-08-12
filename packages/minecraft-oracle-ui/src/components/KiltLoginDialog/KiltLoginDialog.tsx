import { FormControl, Input, Button, useDisclosure, useToast, ToastId } from "@chakra-ui/react"
import { ReactNode, useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { MailForward } from "tabler-icons-react"
import { MoonsamaModal } from "../../components/MoonsamaModal"
import { useKiltLoginDialog } from "../../hooks/useKiltLoginDialog/useKiltLoginDialog"
import { useEmailLoginCodeVerifyMutation } from "../../state/api/bridgeApi"

export const KiltLoginDialog: React.FC<{}> = ({ }) => {
    const { isKiltLoginDialogOpen, onKiltLoginDialogOpen, onKiltLoginDialogClose } = useKiltLoginDialog()
    const [verifyEmailLoginCode, { error, isUninitialized, isLoading, isSuccess, isError, reset }] = useEmailLoginCodeVerifyMutation()
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
        reset()
    }, [isKiltLoginDialogOpen])

    /*
        //HTTP REQ SUCCESS/FAIL
        useEffect(() => {
            if (isError && isKiltLoginDialogOpen) {
                closeLastToast()
                toastIdRef.current = toast({
                    title: 'Failed to verify login code.',
                    description: bridgeApiErrorFormatter(error),
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
        }*/
    const handleSubmit = () => {

    }

    return (<><MoonsamaModal
        isOpen={isKiltLoginDialogOpen}
        onClose={onKiltLoginDialogClose}
    >


        <Button isLoading={isLoading} isDisabled={isLoading} marginTop="16px" w="100%" onClick={() => { handleSubmit() }}>LOG IN</Button>

    </MoonsamaModal>
    </>
    )
}