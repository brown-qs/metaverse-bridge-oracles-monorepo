import { ComponentStyleConfig } from '@chakra-ui/react'

const Button: ComponentStyleConfig = {
    defaultProps: {
        variant: "moonsamaSolid",
    },
    variants: {
        moonsamaSolid: {
            fontFamily: "Orbitron",
            overflow: "hidden",
            fontWeight: "normal",
            fontSize: "12px",
            borderRadius: "4px",
            color: "white",
            border: "1px solid",
            borderColor: "teal.500",
            bg: "teal.500",
            _hover: {
                border: "1px solid",
                borderColor: "teal.200",
                bg: "teal.600",
                _disabled: {
                    borderColor: "teal.500",
                    bg: "teal.500",
                }
            },
            _active: {
                border: "1px solid",
                borderColor: "teal.200",
                bg: "teal.800"
            },

        },
        moonsamaGhost: {
            fontFamily: "Orbitron",
            overflow: "hidden",
            fontWeight: "normal",
            fontSize: "12px",
            borderRadius: "4px",
            color: "white",
            border: "1px solid",
            borderColor: "transparent",
            bg: "transparent",
            _hover: {
                border: "1px solid",
                borderColor: "teal.200",
                bg: "whiteAlpha.100",
                _disabled: {
                    borderColor: "transparent",
                    bg: "transparent",
                }
            },
            _active: {
                border: "1px solid",
                borderColor: "teal.200",
                bg: "whiteAlpha.300"
            },

        }
    }
}

export default Button