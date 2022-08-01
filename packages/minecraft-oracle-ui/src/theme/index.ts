import { extendTheme } from '@chakra-ui/react'
import Button from './components/button'
import Modal from './components/modal'
import colors from './foundations/colors'
import fonts from './foundations/fonts'
const overrides = {
    colors,
    fonts,
    components: {
        Button,
        Modal
    },
}

export default extendTheme(overrides)