import { ReactNode } from 'react';
import { StyledGlitch } from './GlitchText.styles';
import { TypographyProps } from '@mui/material';

export const GlitchText = ({
  children,
  ...props
}: {
  children: ReactNode;
} & TypographyProps) => {
  return (
    <StyledGlitch {...props}>
      <span aria-hidden="true">{children}</span>
      {children}
      <span aria-hidden="true">{children}</span>
    </StyledGlitch>
  );
};
