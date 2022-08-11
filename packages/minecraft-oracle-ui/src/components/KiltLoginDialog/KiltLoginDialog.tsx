import { FormControl, Input, Button, useDisclosure } from "@chakra-ui/react"
import { ReactNode, useEffect } from "react"
import { MailForward } from "tabler-icons-react"
import { MoonsamaModal } from "../../components/MoonsamaModal"

export const KiltLoginDialog: React.FC<{}> = ({ }) => {
    const { isOpen: modalIsOpen, onOpen, onClose } = useDisclosure()


    return (<MoonsamaModal
        isOpen={modalIsOpen}
        onClose={onClose}
        title="Email"
        message="Log in with the code you will receive to the provided email address."
    >

        <FormControl>
            <Input
                placeholder="Email Address"
                type='email'
            />
        </FormControl>
        <Button marginTop="16px" leftIcon={<MailForward></MailForward>} w="100%">LOG IN WITH EMAIL</Button>
    </MoonsamaModal>)
}