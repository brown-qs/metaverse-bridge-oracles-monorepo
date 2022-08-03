import { ComponentStyleConfig } from '@chakra-ui/react'

const Modal: ComponentStyleConfig = {
    baseStyle: {
        dialog: {
            borderRadius: "8px",
            color: "white",
            bg: "linear-gradient(311.18deg, #1A202C 67.03%, #4A5568 100%)",
            boxShadow: "0px 25px 50px -12px rgba(0, 0, 0, 0.25)"
        },
        overlay: {
            background: "rgba(0, 0, 0, 0.64)",
            backdropFilter: "blur(8px)"
        }
    }
}

export default Modal