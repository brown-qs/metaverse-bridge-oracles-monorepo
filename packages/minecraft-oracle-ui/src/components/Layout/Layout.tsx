import { Box } from '@chakra-ui/react'
import { Container } from '@chakra-ui/react'
import MoonsamaNav from 'ui/Navigation/MoonsamaNav';

import { LayoutProps } from './Layout.types';

export const Layout = ({ children }: LayoutProps) => {
  return (
    <Box minHeight="100vh" display="flex" flexDirection="column">
      <MoonsamaNav />
      <Container paddingLeft="0" paddingRight="0" flex="1" maxWidth="false">{children}</Container>
    </Box>
  )
};
