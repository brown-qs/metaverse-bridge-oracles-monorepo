import Container from '@material-ui/core/Container';

import { LayoutProps } from './Layout.types';

export const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <Container maxWidth="lg">{children}</Container>
    </>
  );
};
