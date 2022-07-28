import { Box } from '@chakra-ui/react'
import { Container } from '@chakra-ui/react'
import MoonsamaNav from 'ui/Navigation/MoonsamaNav';

import { LayoutProps } from './Layout.types';
import BackgroundImage from '../../assets/images/home/background.jpg'

export const Layout = ({ children }: LayoutProps) => {
  return (
    <Box minHeight="100vh" display="flex" flexDirection="column" sx={{ background: "blue" }}>
      <MoonsamaNav />
      <Container paddingLeft="0" paddingRight="0" flex="1" maxWidth="false" sx={{
        backgroundImage: `url(${BackgroundImage})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
      }}>{children}</Container>
    </Box>
  )
};
