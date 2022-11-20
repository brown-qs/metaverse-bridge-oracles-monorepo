import { Box, Container, VStack } from '@chakra-ui/react'
import React from 'react';
import { ReactNode } from 'react';
import MoonsamaNav from '../ui/Navigation/MoonsamaNav'

export const MoonsamaLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (<Box
    bg="#080714"
    sx={{ "--moonsama-nav-height": "64px", "--moonsama-leftright-padding": { base: "16px", lg: "48px" } }}
  >
    <MoonsamaNav />
    <Box
      as='main'
      sx={{ px: 'var(--moonsama-leftright-padding)', pt: 'var(--moonsama-nav-height)', minHeight: 'calc(100vh)' }}
    >
      {children}
    </Box>
  </Box >)
};
