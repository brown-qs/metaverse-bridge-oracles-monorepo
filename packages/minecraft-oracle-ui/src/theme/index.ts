import { extendTheme } from '@chakra-ui/react'
import Button from './components/button'
import Checkbox from './components/checkbox'
import Modal from './components/modal'
import colors from './foundations/colors'
import config from './foundations/config'
import fonts from './foundations/fonts'
const overrides = {
    config,
    colors,
    fonts,
    components: {
        Button,
        Modal,
        Checkbox
    },
}

export default extendTheme(overrides)