import Container from '@mui/material/Container';

import { LayoutProps } from './Layout.types';

export const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <Container maxWidth="lg">{children}</Container>
    </>
  );
};
