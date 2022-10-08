import { ComponentStyleConfig } from '@chakra-ui/react'
import fonts from '../foundations/fonts'

const Alert: ComponentStyleConfig = {
    baseStyle: {
        container: { color: "white", fontFamily: fonts.body },
        title: {
            fontWeight: "bold",
        },


    },
    variants: {
        //chakra toasts use alerts under the hood they are solid variant
        solid: (props) => {
            const { colorScheme: c } = props
            return {
                container: {
                    bg: `${c}.500`, // or literal color, e.g. "#0984ff"
                },
                icon: {
                    color: "white"
                },
                title: {
                    color: "white"
                },
                description: {
                    color: "white"
                }
            }
        }
    }
}

export default Alert