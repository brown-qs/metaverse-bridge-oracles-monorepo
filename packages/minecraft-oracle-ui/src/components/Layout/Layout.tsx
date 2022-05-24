import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import MoonsamaNav from 'ui/Navigation/MoonsamaNav';

import { LayoutProps } from './Layout.types';

export const Layout = ({ children }: LayoutProps) => {
  return (
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <MoonsamaNav/>
        <Container style={{paddingLeft: 0, paddingRight: 0}} maxWidth={false}>{children}</Container>
      </Box>
  )
};
