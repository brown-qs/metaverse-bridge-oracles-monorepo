import { Box, Container, VStack } from '@chakra-ui/react'
import { ReactNode } from 'react';
import BackgroundImage from '../assets/images/home/background.jpg'
import MoonsamaNav from '../ui/Navigation/MoonsamaNav'

export const MoonsamaLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <VStack
      h="100vh"
      spacing="0"
      alignItems="stretch"
      minWidth="320px"
    >
      <MoonsamaNav />
      <Box
        position="relative"
        flex="1"
        background="#161328"
      >
        {children}
      </Box>
    </VStack >
  )
};
