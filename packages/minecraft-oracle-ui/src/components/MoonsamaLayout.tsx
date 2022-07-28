import { Box, Container } from '@chakra-ui/react'
import { ReactNode } from 'react';
import BackgroundImage from '../assets/images/home/background.jpg'
import MoonsamaNav from '../ui/Navigation/MoonsamaNav'

export const MoonsamaLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
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
