import { ReactNode } from 'react';
import { useClasses } from 'hooks';
import { StyledPriceBox } from './PriceBox.styles';

export const PriceBox = ({
  children,
  variant = 'primary',
  size = 'medium',
  margin = true,
  color,
}: {
  children: ReactNode;
  variant?: 'primary' | 'secondary';
  size?: 'small' | 'medium';
  margin?: boolean;
  color?: string;
}) => {
  return (
    <StyledPriceBox
      variant={variant}
      size={size}
      margin={margin}
      color={color}
    >
      {children}
    </StyledPriceBox>
  );
};
